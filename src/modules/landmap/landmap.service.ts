// notification.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
    IslandOwner,
    IslandOwnerItem,
    Mrland,
    LeaderBoard,
    IslandUser,
    MrlandDocument,
    Mrlands
} from './entities/mrland.entity';
import { Island, IslandDocument } from './entities/island.entity';
import { User } from '../users/entities/user.entity';
import { PublicLandmapGateway } from '../gateways/public/public-landmap.gateway';
import { Wallet, WalletDocument } from './entities/wallet.entity';
import { CreateMrlandEventInput } from './dto/create-event.input';
import { Post, PostDocument } from '../feeds/entities/post.entity';
import { is24hoursCompleted } from 'src/helpers/timeDuration.helper';
import { NotificationService } from '../notifications/notification.service';
import {
    ENotificationFromType,
    NotificationType
} from '../notifications/notifications.enum';

@Injectable()
export class LandmapService {
    public leaderboards: LeaderBoard[] = [];
    public topOwners: IslandUser[] = [];
    public cooldown = 5 * 60 * 1000;
    constructor(
        @InjectModel(Mrland.name) private mrlandModel: Model<MrlandDocument>,
        @InjectModel(Island.name) private islandModel: Model<IslandDocument>,
        @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
        @InjectModel(User.name) private userModel: Model<User>,
        private publicLandmapGateway: PublicLandmapGateway,
        @InjectModel(Post.name) public postModel: Model<PostDocument>,
        private notificationService: NotificationService
    ) {
        // setInterval(() => this.init(), this.cooldown);
        this.init();
    }

    private OWNER_NAME = 'CihanSasmaz';
    async init() {
        for (let i = 0; i < 30; i++) {
            const leaderboard = await this.getLeaderboard(i + 1);
            this.leaderboards[i] = leaderboard;
        }

        this.topOwners = await this.getTopGlobal();
    }

    async findById(id: Types.ObjectId) {
        return this.mrlandModel.findById(id).exec();
    }

    async findIslandById(id: Types.ObjectId): Promise<Island> {
        return await this.islandModel.findById(id);
    }

    async getLeaderboard(islandNum: number): Promise<LeaderBoard> {
        const island: Island = await this.islandModel
            .findOne({ island: islandNum })
            .exec();
        // let islandCnt = islands.length;
        // for (let idx = 0; idx < islandCnt; idx++) {
        const result = await this.mrlandModel.aggregate([
            {
                $match: {
                    island: islandNum,
                    status: 1
                }
            },
            {
                $lookup: {
                    from: 'wallets',
                    localField: 'owner',
                    foreignField: 'address',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user'
                }
            },
            {
                $group: {
                    _id: '$user.userId',
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: -1
                }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            }
        ]);

        // result[0].user this user will always on Top so we're making this user a king
        if (!result[0]?.isKing) {
            await this.userModel.findByIdAndUpdate(
                result[0]?._id,
                {
                    isKing: true
                },
                { new: true }
            );

            if (
                !(await this.notificationService.findOneByClause({
                    type: NotificationType.SYSTEM,
                    receiver: result[0]?._id
                }))
            ) {
                this.notificationService.create({
                    type: NotificationType.SYSTEM,
                    sender: ENotificationFromType.APP,
                    message: 'You are become a king!',
                    receiver: result[0]?._id
                });
            }
        }

        return {
            owners: result,
            island: island
        };
    }
    async leaderboard(islandNum: number): Promise<LeaderBoard> {
        return this.leaderboards[islandNum - 1];
    }
    async getUserMrlandCount(id: Types.ObjectId) {
        const wallets = await this.walletModel.find({ userId: id }).exec();
        const walletAddrs = wallets.map((wallet: Wallet) => wallet.address);
        const lands = await this.mrlandModel
            .find({ owner: { $in: walletAddrs } })
            .exec();
        return lands.length;
    }
    async getUserByWallet(wallet: string) {
        const walletObj = await this.walletModel
            .findOne({
                address: wallet
            })
            .exec();
        if (!walletObj) return null;
        return await this.userModel.findById(walletObj.userId).exec();
    }
    async getIslandUser(id: string, magnitude: number) {
        const islandUesr = await this.userModel.findById(id);
        if (!islandUesr) return null;
        const newIslandUser = {
            user: islandUesr,
            landCount: magnitude
        };
        // if (
        //     !newIslandUser.user ||
        //     newIslandUser.user.userName === this.OWNER_NAME
        // )
        //     return null;

        return newIslandUser;
    }
    async topGlobal(): Promise<IslandUser[]> {
        return this.topOwners;
    }
    async getTopGlobal(): Promise<IslandUser[]> {
        const result = await this.mrlandModel.aggregate([
            {
                $match: {
                    status: 1
                }
            },
            {
                $lookup: {
                    from: 'wallets',
                    localField: 'owner',
                    foreignField: 'address',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user'
                }
            },
            {
                $group: {
                    _id: '$user.userId',
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    count: -1
                }
            },
            {
                $limit: 20
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $project: {
                    'user.invitation_code': 0,
                    'user.email': 0,
                    'user.roles': 0,
                    'user.phoneNumber': 0,
                    'user.lastLogin': 0
                }
            }
        ]);
        return result;
    }

    async getIslandOwnersInfo(islandNum: number): Promise<IslandOwner[]> {
        const island = await this.islandModel
            .find({
                island: islandNum
            })
            .exec();

        const result = await this.mrlandModel.aggregate([
            {
                $match: {
                    island: island['island'],
                    status: 1
                }
            },
            {
                $group: {
                    _id: '$owner',
                    magnitude: { $sum: 1 }
                }
            },
            {
                $sort: { magnitude: -1 }
            }
        ]);
        const island_owners = [];
        for (let k = 0; k < result.length; k++) {
            const islandUsr = await this.getUserByWallet(result[k]['_id']);
            if (!islandUsr) continue;
            const newIslandUser = {
                user: islandUsr,
                island: island['name'],
                landCount: result[k]['magnitude']
            };
            const newIslandInfo = await this.userModel.findOne({
                _id: newIslandUser.user._id
            });
            newIslandUser['followers'] = newIslandInfo
                ? newIslandInfo.followers.length
                : 0;
            newIslandUser['info'] = newIslandInfo;
            island_owners.push(newIslandUser);
        }

        return island_owners;
    }

    async nfts(): Promise<Mrlands> {
        const result = await this.mrlandModel
            .find({ isPlot: 1, status: 1 })
            .exec();
        const lands: Record<string, Mrland> = {};
        for (let index = 0; index < result.length; index++) {
            const temp = result[index];
            lands[temp['posX'] + '_' + temp['posY']] = temp;
        }
        return { lands };
    }

    async nftsListing(): Promise<Mrlands> {
        const contractAddrs = [
            '0xa94c3453001A0CE7C9d38323556d9D243C41a28E',
            '0x71003D0443a5c939478B417794067310Cb51630c',
            '0x3803EE8fe4B0E096B73CA40796a79b88113C80c4',
            '0x7c51DD0fe21E3b6800522c2E5c660D872402Bc19',
            '0x389DEf2A2c0792dBd54fcdB4004e6CBfBdb7FabB'
        ];

        const result = await this.mrlandModel
            .find({
                owner: {
                    $in: [
                        contractAddrs[0],
                        contractAddrs[1],
                        contractAddrs[2],
                        contractAddrs[3],
                        contractAddrs[4]
                    ]
                },
                status: 1
            })
            .exec();

        const lands: Record<string, Mrland> = {};

        for (let index = 0; index < result.length; index++) {
            const temp = result[index];
            lands[temp['posX'] + '_' + temp['posY']] = temp;
        }

        return { lands };
    }

    async nftsAddress(owner: string): Promise<Mrlands> {
        const result = await this.mrlandModel.find({ owner, status: 1 }).exec();
        // { $regex: new RegExp(owner, 'i') }

        const lands: Record<string, Mrland> = {};

        for (let index = 0; index < result.length; index++) {
            const temp = result[index];
            lands[temp['posX'] + '_' + temp['posY']] = temp;
        }

        return { lands };
    }

    async islands(): Promise<Island[]> {
        const islands = await this.islandModel.find({}).exec();
        return islands;
    }

    async islandOwners(): Promise<IslandOwnerItem[]> {
        const arr_result = [];
        const islands = await this.islandModel.find({}).exec();
        const islandCnt = islands.length;

        for (let idx = 0; idx < islandCnt; idx++) {
            const results = await this.mrlandModel.aggregate([
                { $match: { island: islands[idx]['island'], status: 1 } },
                { $group: { _id: '$owner', magnitude: { $sum: 1 } } },
                { $sort: { magnitude: -1 } },
                { $limit: 1 }
            ]);
            // sql = `SELECT owner, COUNT('owner') AS magnitude FROM tb_nftpilot  WHERE island = ${islands[idx]['island']} AND status=1 GROUP BY owner ORDER BY magnitude DESC LIMIT 1`;
            arr_result.push({
                owner: results[0]['_id'],
                magnitude: results[0]['magnitude']
            });
        }

        return arr_result;
    }

    async updateLand(
        wallet: string,
        id: string,
        name: string,
        description: string,
        logo: string,
        applyAll: boolean
    ): Promise<Mrland[]> {
        let filter = {};
        if (applyAll) {
            filter = { owner: wallet };
        } else {
            filter = { _id: new Types.ObjectId(id) };
        }
        const mrlands = await this.mrlandModel.find(filter).exec();
        for (const mrland of mrlands) {
            mrland.name = name;
            mrland.description = description;
            mrland.logo = logo;
            mrland.save();
        }
        this.publicLandmapGateway.emitMrlandsUpdated(mrlands);
        return mrlands;
    }

    async updateIsland(
        id: string,
        name: string,
        description: string,
        logo: string
    ): Promise<Island> {
        const island = await this.islandModel.findById(id).exec();
        island.name = name;
        island.description = description;
        island.logo = logo;
        await island.save();
        this.publicLandmapGateway.emitIslandUpdated(island);
        return island;
    }
    async findMrLand(id: Types.ObjectId): Promise<Mrland> {
        return this.mrlandModel.findById(id).exec();
    }
    async updateMrlands(event: CreateMrlandEventInput): Promise<boolean> {
        const updatedLand = await this.mrlandModel
            .findOne({ landID: event.values.tokenId })
            .exec();
        updatedLand.owner = event.values.to.toUpperCase();
        updatedLand.status = 1;
        await updatedLand.save();
        this.publicLandmapGateway.emitMrlandsUpdated([updatedLand]);
        return true;
    }

    async updateMrlandForPost(id: string): Promise<Mrland> {
        const landToUpdate = await this.mrlandModel
            .findOne({ _id: new Types.ObjectId(id) })
            .exec();

        if (landToUpdate.post)
            throw new Error('This land already having a post!');

        const post = await new this.postModel({
            mrland: new Types.ObjectId(id)
            // author: userId
        });
        landToUpdate.post = post._id;

        await post.save();
        const updatedLand = await landToUpdate.save();

        return updatedLand;
    }

    async likeMrLand(id: string, userId: string): Promise<Mrland> {
        const mrland = await this.mrlandModel.findOne({ landID: id });

        const likedIndex = mrland.likesBy.findIndex((x) =>
            x.user?.equals(userId)
        );

        const dislikedIndex = mrland.dislikesBy.findIndex((x) =>
            x.user?.equals(userId)
        );

        const newLikeObj = {
            user: new Types.ObjectId(userId),
            at: new Date()
        };

        let newLikesBy = [...mrland.likesBy];

        if (
            likedIndex !== -1 &&
            is24hoursCompleted(mrland.likesBy[likedIndex]?.at)
        ) {
            newLikesBy[likedIndex] = newLikeObj;
        } else if (likedIndex === -1) {
            newLikesBy = [...newLikesBy, newLikeObj];
        }

        const update =
            dislikedIndex !== -1 &&
            !is24hoursCompleted(mrland.likesBy[dislikedIndex]?.at)
                ? {
                      $inc: { dislikes: -1, likes: 1 },
                      $pull: { dislikesBy: mrland.dislikesBy[dislikedIndex] },
                      $addToSet: {
                          likesBy: newLikeObj
                      }
                  }
                : likedIndex !== -1 &&
                  is24hoursCompleted(mrland.likesBy[likedIndex]?.at)
                ? {
                      $inc: { likes: 1 },
                      likesBy: newLikesBy
                  }
                : likedIndex !== -1 &&
                  !is24hoursCompleted(mrland.likesBy[likedIndex]?.at)
                ? {
                      $inc: { likes: -1 },
                      $pull: { likesBy: mrland.likesBy[likedIndex] }
                  }
                : {
                      $inc: { likes: 1 },
                      likesBy: newLikesBy
                  };
        const updatedMrLand = await this.mrlandModel.findOneAndUpdate(
            {
                landID: id
            },
            update,
            { returnOriginal: false }
        );
        return updatedMrLand;
    }

    async dislikeMrLand(id: string, userId: string): Promise<Mrland> {
        const mrland = await this.mrlandModel.findOne({ landID: id });
        const dislikedIndex = mrland.dislikesBy.findIndex((x) =>
            x.user?.equals(userId)
        );

        const likedIndex = mrland.likesBy.findIndex((x) =>
            x.user?.equals(userId)
        );

        const newDislikeObj = {
            user: new Types.ObjectId(userId),
            at: new Date()
        };

        let newdisLikesBy = [...mrland.dislikesBy];

        if (
            dislikedIndex !== -1 &&
            is24hoursCompleted(mrland.dislikesBy[dislikedIndex]?.at)
        ) {
            newdisLikesBy[dislikedIndex] = newDislikeObj;
        } else if (dislikedIndex === -1) {
            newdisLikesBy = [...newdisLikesBy, newDislikeObj];
        }

        const update =
            likedIndex !== -1 &&
            !is24hoursCompleted(mrland.likesBy[likedIndex]?.at)
                ? {
                      $inc: { likes: -1, dislikes: 1 },
                      $pull: { likesBy: mrland.likesBy[likedIndex] },
                      $addToSet: { dislikesBy: newDislikeObj }
                  }
                : dislikedIndex !== -1 &&
                  is24hoursCompleted(mrland.dislikesBy[dislikedIndex]?.at)
                ? {
                      $inc: { dislikes: 1 },
                      dislikesBy: newdisLikesBy
                  }
                : dislikedIndex !== -1 &&
                  !is24hoursCompleted(mrland.dislikesBy[dislikedIndex]?.at)
                ? {
                      $inc: { dislikes: -1 },
                      $pull: { dislikesBy: mrland.dislikesBy[dislikedIndex] }
                  }
                : {
                      $inc: { dislikes: 1 },
                      dislikesBy: newdisLikesBy
                  };

        const updatedMrLand = await this.mrlandModel.findOneAndUpdate(
            {
                landID: id
            },
            update,
            { returnOriginal: false }
        );

        return updatedMrLand;
    }

    mrland_active(landId, status) {
        return this.mrlandModel.findOneAndUpdate(
            { landID: landId },
            { billboard: status },
            { new: true }
        );
    }
}
