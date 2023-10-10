import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { VerificationService } from '../verification/verification.service';
import { verificationTypes } from 'src/constants/auth';
import { EmailService } from '../shared/services/email.service';
import { FilterQuery, Model, Types } from 'mongoose';
import { AppGateway } from 'src/app.gateway';
import { generateRandomNumber } from 'src/helpers/common.helpers';
import {
    ContentCreatorStats,
    ProfileInput,
    SettingsInput
} from './dto/users.input';
import { COLLECTIONS, USERS } from 'src/constants/db.collections';
import { Wallet, WalletDocument } from './entities/wallet.entity';
import { HashtagsService } from '../feeds/hashtags.service';
import { HashtagDocument } from '../feeds/entities/hashtag.entity';
import { PublicUserGateway } from '../gateways/public/public-user.gateway';
import { recoverMessageAddress } from 'viem';
import { ScoresService } from '../scores/scores.service';
import { Group, GroupDocument } from '../chat/entities/group.entity';
import { Feed, FeedDocument } from '../feeds/entities/feed.entity';
import {
    Reaction,
    ReactionDocument
} from '../reactions/entities/reaction.entity';
import { countries } from 'src/constants/country.contants';
import { HashtagCount } from '../feeds/entities/hashcount.entity';
import { CollectionDocument } from '../collections/entities/collection.entity';
import { Nft, NftDocument } from '../nfts/entities/nft.entity';
import { SuccessPayload } from '../admin/dto/create-admin.input';
import { CollectionsService } from '../collections/collections.service';
import { generateOGImage } from 'src/helpers/linkPreviews';
import { NftsService } from '../nfts/nfts.service';
import {
    Notification,
    NotificationDocument
} from '../notifications/entities/notification.entity';
import {
    ENotificationFromType,
    NotificationType
} from '../notifications/notifications.enum';
import { Post, PostDocument } from '../feeds/entities/post.entity';
// import {
//     ENotificationFromType,
//     NotificationType
// } from '../notifications/notifications.enum';
// import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class UsersService {
    constructor(
        // eslint-disable-next-line no-unused-vars
        @InjectModel(USERS)
        readonly userModel: Model<UserDocument>,
        @InjectModel(COLLECTIONS)
        private collectionModel: Model<CollectionDocument>,
        @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
        @InjectModel(Group.name) private groupModel: Model<GroupDocument>,
        @InjectModel(Feed.name) private feedModel: Model<FeedDocument>,
        @InjectModel(Reaction.name)
        private reactionModel: Model<ReactionDocument>,
        @InjectModel(Nft.name)
        private tokenModel: Model<NftDocument>,
        private readonly verificationService: VerificationService,
        private readonly emailService: EmailService,
        private publicUserGateway: PublicUserGateway,
        //private notificationService: NotificationService,
        private readonly appGateway: AppGateway,
        private readonly hashtagsService: HashtagsService,
        private readonly scoresService: ScoresService,
        private readonly collectionsService: CollectionsService,
        private readonly nftService: NftsService,
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<NotificationDocument>,
        @InjectModel(Post.name)
        private readonly postModel: Model<PostDocument>
    ) {}

    public hideFields =
        '-email -roles -phoneNumber -lastLogin -invitation_code -login_attempts -lockedAt';

    create(data) {
        return this.userModel.create(data);
    }

    async findWalletsByUserId(
        id: string | Types.ObjectId
    ): Promise<WalletDocument[]> {
        return this.walletModel.find({ userId: id }).exec();
    }
    async findAll(
        query?: FilterQuery<UserDocument>,
        isSecure?: boolean
    ): Promise<UserDocument[]> {
        if (isSecure) {
            return this.userModel.find(query).select(this.hideFields).exec();
        } else {
            return (
                this.userModel
                    .find(query)
                    // .select(this.hideFields)
                    .exec()
            );
        }
    }

    async findUserById(id: string | Types.ObjectId): Promise<UserDocument> {
        return (
            this.userModel
                .findById(id)
                // .select(this.hideFields)
                .exec()
        );
    }

    async findOne(
        clause: {
            [key: string]: unknown;
        },
        isSecure?: boolean
    ): Promise<UserDocument | undefined> {
        let user;
        if (isSecure) {
            user = await this.userModel
                .findOne(clause)
                .select(this.hideFields)
                .exec();
        } else {
            user = await this.userModel.findOne(clause).exec();
        }
        if (user) return user;
        return undefined;
    }

    async findById(
        id: Types.ObjectId,
        isSecure?: boolean
    ): Promise<UserDocument> {
        if (isSecure) {
            return this.userModel.findById(id).select(this.hideFields).exec();
        } else {
            return (
                this.userModel
                    .findById(id)
                    // .select(this.hideFields)
                    .exec()
            );
        }
    }

    async findByAddress(address: string): Promise<UserDocument> {
        return this.userModel.findOne({ wallet: address }).exec();
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    // ---------------------------------------------------------

    async findOneByEmail(email: string): Promise<UserDocument | undefined> {
        const user = await this.userModel
            .findOne({ email: email.toLowerCase() })
            // .select(this.hideFields)
            .exec();
        if (user) return user;
        return undefined;
    }

    async findOneAndUpdate(
        clause: {
            [key: string]: unknown;
        },
        data
    ): Promise<UserDocument | undefined> {
        const results = await this.userModel
            .findOneAndUpdate(clause, data, {
                new: true
            })
            .exec();
        return results;
    }

    // ----------------- MOVED TO FEED SERVICES

    // async follow(otherUser, userId) {
    //     const following = await this.userModel
    //         .findOne({ _id: otherUser })
    //         .lean()
    //         .exec();

    //     const isFollower =
    //         following?.followers?.filter((el) => el.toString() == userId)
    //             .length > 0;
    //     await this.scoresService.createScore(
    //         otherUser,
    //         isFollower ? 'unfollowers' : 'followers'
    //     );
    //     const newFollowersCount = isFollower
    //         ? Number(following.followersCount || 0) - 1
    //         : Number(following.followersCount || 0) + 1;

    //     const followersTimestamps = {
    //         by: userId,
    //         createdAt: new Date()
    //     };
    //     await this.userModel
    //         .findByIdAndUpdate(otherUser, {
    //             [isFollower ? '$pull' : '$addToSet']: {
    //                 followers: userId,
    //                 followersTimestamps: isFollower
    //                     ? { by: userId }
    //                     : followersTimestamps
    //             },
    //             followersCount: newFollowersCount
    //         })
    //         .exec();

    //     // this.publicUserGateway.emitUserUpdated(
    //     //     { followersCount: newFollowersCount },
    //     //     otherUser
    //     // );
    //     if (!isFollower) {
    //         /* Notification */
    //         // if (userId.toString() !== otherUser.toString()) {
    //         //     this.notificationService.create({
    //         //         type: NotificationType.COMMENT,
    //         //         sender: ENotificationFromType.USER,
    //         //         from: userId,
    //         //         receiver: otherUser,
    //         //     });
    //         // }
    //     }
    //     const user = await this.userModel
    //         .findOne({ _id: userId })
    //         .lean()
    //         .select({ password: 0, email: 0, key: 0 })
    //         .exec();

    //     const isFollowed =
    //         user?.following?.filter((el) => el.toString() == otherUser).length >
    //         0;
    //     await this.scoresService.createScore(
    //         userId,
    //         isFollowed ? 'unfollow' : 'follow'
    //     );

    //     const followingTimestamps = {
    //         by: new Types.ObjectId(otherUser),
    //         createdAt: new Date()
    //     };
    //     const updatedUser = await this.userModel
    //         .findByIdAndUpdate(
    //             userId,
    //             {
    //                 [isFollowed ? '$pull' : '$addToSet']: {
    //                     following: otherUser,
    //                     followingTimestamps: isFollowed
    //                         ? { by: new Types.ObjectId(otherUser) }
    //                         : followingTimestamps
    //                 },
    //                 followingCount: isFollowed
    //                     ? Number(user.followingCount || 0) - 1
    //                     : Number(user.followingCount || 0) + 1
    //             },
    //             {
    //                 new: true
    //             }
    //         )
    //         .select({ password: 0, email: 0, key: 0 })
    //         .populate('followers')
    //         .populate('following')
    //         .populate('followingHashtags');

    //     return updatedUser;
    // }

    async send2FaVerificationCode(
        userId: Types.ObjectId,
        email: string,
        firstName: string
    ) {
        const code = generateRandomNumber();
        this.verificationService.createCode(
            code,
            userId,
            verificationTypes.TWO_FA
        );

        return await this.emailService.sendVerificationCode(
            email,
            code,
            firstName
        );
    }

    async changeSettings(userId: Types.ObjectId, data: SettingsInput) {
        return this.userModel.findOneAndUpdate(
            { _id: userId },
            { settings: data },
            {
                new: true
            }
        );
    }

    async searchUsers(
        query: string,
        loggedUserId?: Types.ObjectId,
        groupId?: string
    ): Promise<User[]> {
        const filter = { userName: { $regex: `^${query}`, $options: 'i' } };
        if (loggedUserId) {
            const user = await this.userModel.findById(loggedUserId).exec();

            filter['_id'] = { $nin: [...user.blockedUsers, user._id] };
            if (!query) {
                filter['_id'] = { $in: user.followers };
            }
        }
        if (groupId) {
            const group = await this.groupModel.findById(groupId).exec();
            const users = [
                ...group.admins,
                ...group.members.map((item) => item.member)
            ];
            if (filter['_id']) {
                filter['$and'] = [
                    { _id: filter['_id'] },
                    { _id: { $in: users } }
                ];
                delete filter['_id'];
            } else {
                filter['_id'] = { $in: users };
            }
        }
        const searchedUsers = await this.userModel.find(filter).limit(5).exec();
        console.log(searchedUsers, filter, 'filterfilterfilter');

        return searchedUsers;
    }

    async editProfile(id: Types.ObjectId, data: ProfileInput) {
        const _user = await this.userModel.findById(id);

        if (data.firstName || data.lastName) {
            const nameExp =
                /^(?![^\s]*https?|www\.)(?=[^\d\s]{1,10}$)[A-Za-z\s]*$/;

                if(!nameExp.test(data.firstName) || !nameExp.test(data.lastName)){
                    throw new Error('Name must be valid ');
                }
        }

        if (
            _user.userNameUpdateAt &&
            data.userName &&
            _user.userName !== data.userName
        ) {
            const isUserNameExist = await this.userModel.findOne({
                userName: data.userName
            });
            if (isUserNameExist) {
                throw new Error('Username already in use!');
            }
            const currentDate = new Date();
            const userNameUpdatedAt = new Date(_user.userNameUpdateAt);
            const timeDifference =
                currentDate.getTime() - userNameUpdatedAt.getTime();
            const daysDifference = timeDifference / (1000 * 3600 * 24);

            if (daysDifference >= 7) {
                return this.userModel.findByIdAndUpdate(
                    id,
                    { $set: { ...data } },
                    { new: true }
                );
            } else {
                throw new Error('Username can only be changed once in 7 days');
            }
        } else {
            return this.userModel.findByIdAndUpdate(
                id,
                {
                    $set: {
                        ...data,
                        ...(data.userName && { userNameUpdateAt: new Date() })
                    }
                },
                { new: true }
            );
        }
    }

    async refetchUser(id: Types.ObjectId) {
        const refetch = await this.userModel.findById(id);
        return { user: refetch };
    }

    async blockUser(
        userId: Types.ObjectId,
        targetUserId: Types.ObjectId
    ): Promise<User> {
        let isfollower = false;
        let isfollowing = false;
        const user: User = await this.userModel.findById(userId).exec();
        const targetUser: User = await this.userModel
            .findById(targetUserId)
            .exec();

        if (
            user.followers.find((follower) =>
                new Types.ObjectId(targetUserId).equals(follower._id)
            )
        ) {
            isfollower = true;
        }
        if (
            user.following.find((following) =>
                new Types.ObjectId(targetUserId).equals(following._id)
            )
        ) {
            isfollowing = true;
        }

        if (isfollower || isfollowing) {
            console.log('targetUser user if runs');
            await this.userModel.findByIdAndUpdate(targetUser, {
                ...(isfollowing && {
                    $pull: { followers: userId },
                    $inc: { followersCount: -1 }
                }),
                ...(isfollower && {
                    $pull: { following: userId }
                })
            });
        }
        return await this.userModel
            .findByIdAndUpdate(
                userId,
                {
                    $addToSet: { blockedUsers: targetUserId },
                    ...(isfollower && {
                        $pull: { followers: targetUserId },
                        $inc: { followersCount: -1 }
                    }),
                    ...(isfollowing && {
                        $pull: { following: targetUserId }
                    })
                },
                { new: true }
            )
            .exec();
    }

    async unblockUser(
        userId: Types.ObjectId,
        targetUserId: Types.ObjectId
    ): Promise<User> {
        return await this.userModel
            .findByIdAndUpdate(
                userId,
                { $pull: { blockedUsers: targetUserId } },
                { new: true }
            )
            .exec();
    }

    async getUserByTwitterId(twitterId: string): Promise<User> {
        return this.userModel.findOne({ twitterId });
    }

    async getUserByFacebookId(facebookId: string): Promise<User> {
        return this.userModel.findOne({ facebookId });
    }

    async connectTwitter(
        userId: string,
        accessToken: string,
        accessSecret: string
    ): Promise<User> {
        const user = await this.userModel.findById(userId);
        const existingUser = await this.userModel.findOne({
            twitterId: user.twitterId
        });

        if (existingUser && existingUser._id.toString() !== userId) {
            // Twitter account already linked to another user
            // throw new ConflictException(
            //     'Twitter account is already linked to another user'
            // );
        }

        user.twitterAccessToken = accessToken;
        user.twitterAccessSecret = accessSecret;
        return await user.save();
    }

    // ------ GLOBAL SEARCH ----------------

    async globalSearch(query: string): Promise<{
        users: UserDocument[];
        hashtags: HashtagDocument[];
        hashtagCount: HashtagCount[];
        collections: CollectionDocument[];
    }> {
        const bannedUsers = await this.allBannedUsers();

        const previousDay = new Date();
        previousDay.setDate(previousDay.getDate() - (query == '' ? 1 : 10000));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aggregation: any = [
            {
                $match: {
                    $or: [
                        {
                            firstName: {
                                $regex: `^${query}`,
                                $options: 'i'
                            }
                        },
                        {
                            lastName: {
                                $regex: `^${query}`,
                                $options: 'i'
                            }
                        },
                        {
                            userName: {
                                $regex: `^${query}`,
                                $options: 'i'
                            }
                        }
                    ],
                    _id: { $nin: bannedUsers }
                }
            }
        ];

        if (!query) {
            aggregation.push(
                {
                    $addFields: {
                        hasRecentFollower: {
                            $cond: {
                                if: { $isArray: '$followersTimestamps' },
                                then: {
                                    $anyElementTrue: {
                                        $map: {
                                            input: '$followersTimestamps',
                                            in: {
                                                $gte: [
                                                    '$$this.createdAt',
                                                    previousDay
                                                ]
                                            }
                                        }
                                    }
                                },
                                else: false
                            }
                        }
                    }
                },
                {
                    $match: {
                        hasRecentFollower: true
                    }
                },
                {
                    $addFields: {
                        recentFollowers: {
                            $filter: {
                                input: '$followersTimestamps',
                                as: 'timestamp',
                                cond: {
                                    $gte: ['$$timestamp.createdAt', previousDay]
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        recentFollowersCount: { $size: '$recentFollowers' }
                    }
                }
            );
        }

        aggregation.push({
            $limit: query == '' ? 3 : 6
        });

        const [users, hashtags, hashtagCount, collections] = await Promise.all([
            this.userModel.aggregate(aggregation),
            this.hashtagsService.searchHashtags(query),
            this.hashtagsService.findTopHashtagsQ(
                query != '' ? -1 : 1,
                query != '' ? -1 : 3,
                query
            ),
            this.collectionModel.aggregate([
                {
                    $match: {
                        ...(query && {
                            name: { $regex: `^${query}`, $options: 'i' }
                        })
                        //   collectionViewsTimestamps: {
                        //       $gte: previousDay
                        //   }
                    }
                },
                {
                    $limit: 3
                }
            ])
        ]);

        const collectionPayload = collections.map((c) => {
            return {
                ...c,
                image: c.image ?? c.image,
                chain: c.chain ?? c?.chainName,
                contract: c.contract ?? c?.contract
            };
        });

        return {
            users: users,
            hashtags: hashtags,
            hashtagCount: hashtagCount,
            collections: collectionPayload
        };
    }

    async addWallet(
        userId: Types.ObjectId,
        signature: string
    ): Promise<WalletDocument> {
        const message =
            'I acknowledge and agree to the terms & conditions and privacy policy of MintStargram.tech.';
        const recoveredAddress = await recoverMessageAddress({
            message,
            signature: signature as `0x${string}`
        });

        // Check if the wallet already exists
        const existingWallet = await this.walletModel
            .findOne({ address: { $regex: new RegExp(recoveredAddress, 'i') } })
            .exec();

        if (existingWallet) {
            // If the wallet already exists, update the data
            existingWallet.userId = userId;
            await existingWallet.save();
            return existingWallet;
        }

        // If the wallet doesn't exist, create a new one
        const newWallet = await this.walletModel.create({
            userId,
            address: recoveredAddress
        });

        return newWallet;
    }

    async deleteWallet(
        userId: Types.ObjectId,
        walletId: string
    ): Promise<WalletDocument> {
        const wallet = await this.walletModel.findById(walletId).exec();
        if (!wallet) {
            throw new Error('This wallet is not exists.');
        }
        if (wallet.userId.toString() !== userId.toString()) {
            throw new Error('You are not the owner of this address.');
        }
        return this.walletModel.findByIdAndDelete(walletId);
    }

    async getUserByWalletAddress(address: string): Promise<WalletDocument> {
        return this.walletModel
            .findOne({
                address: {
                    $regex: new RegExp(`^${address}$`, 'i')
                }
            })
            .populate('userId')
            .select('avatar userName');
    }

    async ownFollowersUsers(loggedUserId: Types.ObjectId): Promise<User[]> {
        const u = await this.userModel.findById(loggedUserId);
        const x = await this.userModel.find({ _id: u.followers });
        return x;
    }

    async ownBlockedUsers(loggedUserId: Types.ObjectId): Promise<User[]> {
        const u = await this.userModel.findById(loggedUserId);
        return this.userModel.find({ _id: u.blockedUsers });
    }

    async allBannedUsers() {
        const bannedUsers = await this.userModel
            .find({ isBanned: true })
            .select('_id');
        return bannedUsers.map((user) => user._id);
    }

    async findUsersByCreatorIds(creatorIds: Types.ObjectId[]): Promise<User[]> {
        // Implement your logic to find users by creatorIds in the database
        // For example:
        const users = await this.userModel
            .find({ _id: { $in: creatorIds } })
            .exec();

        return users;
    }

    // ------------------------- KYC VERIFICATION ----------------------------

    async kycVerify(email: string, status) {
        const checkResult = await this.userModel
            .findOne({ email: email })
            .select('userName isVerified verifyStatus email');
        if (checkResult?.isVerified) {
            return checkResult;
        } else {
            if (status == 7001) {
                const results = await this.userModel
                    .findOneAndUpdate(
                        { email: email },
                        {
                            $set: { verifyStatus: 'Started' }
                        },
                        {
                            new: true
                        }
                    )
                    .select('userName isVerified verifyStatus email');
                return results;
            }
            if (status == 7002) {
                const results = await this.userModel
                    .findOneAndUpdate(
                        { email: email },
                        {
                            $set: { verifyStatus: 'Submitted' }
                        },
                        {
                            new: true
                        }
                    )
                    .select('userName isVerified verifyStatus email');
                return results;
            } else {
                return null;
            }
        }
    }

    async kycVerifyCompleted(email: string, status, document) {
        const checkResult = await this.userModel
            .findOne({ email: email })
            .select('userName isVerified verifyStatus email');
        if (checkResult?.isVerified) {
            return checkResult;
        } else {
            if (status == 9001) {
                let data;

                if (document.country) {
                    data = countries.filter((c) => {
                        if (c.code == document.country) return c;
                    });
                }
                if (data[0]) {
                    await this.userModel.findOneAndUpdate(
                        { email: email },
                        {
                            country: data[0]
                        }
                    );
                }

                const results = await this.userModel
                    .findOneAndUpdate(
                        { email: email },
                        {
                            $set: { verifyStatus: 'Passed', isVerified: true }
                        },
                        {
                            new: true
                        }
                    )
                    .select('userName isVerified verifyStatus email');

                await this.notificationModel.create({
                    type: NotificationType.SYSTEM,
                    sender: ENotificationFromType.APP,
                    message: 'Your account has been KYC Verified',
                    receiver: results._id
                });
                return results;
            } else {
                const results = await this.userModel
                    .findOneAndUpdate(
                        { email: email },
                        {
                            $set: { verifyStatus: 'Failed' }
                        },
                        {
                            new: true
                        }
                    )
                    .select('userName isVerified verifyStatus email');
                return results;
            }
        }
    }

    // -------------------- CONTENT CREATER -------------------

    async contentCreatorStats(
        userId: Types.ObjectId
    ): Promise<ContentCreatorStats> {
        const user = await this.findById(userId);
        let daysSpent, nftsLast7DaysVar, isNFTs;

        const wallets = await this.walletModel.find({ userId: userId });
        // .populate('address');

        const userAddress = wallets.map((x) => x.address);
        console.log(userAddress, 'userAddress', wallets, 'wallets');

        const collections = await this.collectionModel.find({
            owner: { $in: userAddress }
        });

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const SevenDaysAgoInSeconds = Math.floor(sevenDaysAgo.getTime() / 1000);
        console.log(SevenDaysAgoInSeconds, 'SevenDaysAgoInSeconds');

        // await this.tokenModel
        //     .aggregate([
        //         {
        //             $match: {
        //                 owner: { $in: userAddress },
        //                 mintTimestamp: { $gte: SevenDaysAgoInSeconds }
        //             }
        //         },
        //         {
        //             $group: {
        //                 _id: {
        //                     year: {
        //                         $year: { $add: [new Date(0), '$mintTimestamp'] }
        //                     },
        //                     month: {
        //                         $month: {
        //                             $add: [new Date(0), '$mintTimestamp']
        //                         }
        //                     },
        //                     day: {
        //                         $dayOfMonth: {
        //                             $add: [new Date(0), '$mintTimestamp']
        //                         }
        //                     }
        //                 },
        //                 nfts: { $push: '$$ROOT' }
        //             }
        //         },
        //         {
        //             $project: {
        //                 date: {
        //                     $dateFromParts: {
        //                         year: '$_id.year',
        //                         month: '$_id.month',
        //                         day: '$_id.day'
        //                     }
        //                 },
        //                 nfts: 1
        //             }
        //         },
        //         {
        //             $sort: { date: -1 }
        //         }
        //     ])
        //     .exec()
        //     .then((result) => {
        //         // Check if there's at least one NFT for each day in the last 7 days
        //         const daysInLastWeek = Array.from({ length: 7 }, (_, i) => {
        //             const day = new Date();
        //             day.setDate(day.getDate() - i);
        //             return day.toDateString(); // Converting to date string to ignore the time part for comparison
        //         });

        //         const nftsLast7Days = result.map((dayGroup) => {
        //             return {
        //                 date: dayGroup.date.toDateString(), // Converting to date string for comparison
        //                 nfts: dayGroup.nfts
        //             };
        //         });

        //         const isNFTPresentForLast7Days = daysInLastWeek.every((day) =>
        //             nftsLast7Days.some((dayGroup) => dayGroup.date === day)
        //         );
        //         nftsLast7DaysVar = nftsLast7Days;
        //         isNFTs = isNFTPresentForLast7Days;
        //         console.log('NFTs in the last 7 days:', nftsLast7Days);
        //         console.log(
        //             'NFTs present for each day:',
        //             isNFTPresentForLast7Days
        //         );
        //     })
        //     .catch((err) => {
        //         console.error('Error occurred:', err);
        //     });
        await this.postModel
            .aggregate([
                {
                    $match: {
                        author: userId,
                        // createdAt: { $gte: SevenDaysAgoInSeconds },
                        tokenData: { $exists: true, $ne: null },
                        'tokenData.isMinted': true
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' },
                            day: { $dayOfMonth: '$createdAt' }
                        },
                        posts: { $push: '$$ROOT' }
                    }
                },
                {
                    $project: {
                        date: {
                            $dateFromParts: {
                                year: '$_id.year',
                                month: '$_id.month',
                                day: '$_id.day'
                            }
                        },
                        posts: 1
                    }
                },
                {
                    $sort: { date: -1 }
                }
            ])
            .exec()
            .then((result) => {
                // Check if there's at least one post for each day in the last 7 days
                const daysInLastWeek = Array.from({ length: 7 }, (_, i) => {
                    const day = new Date();
                    day.setDate(day.getDate() - i);
                    return day.toDateString(); // Converting to date string to ignore the time part for comparison
                });

                const nftsLast7Days = result.map((dayGroup) => {
                    return {
                        date: dayGroup.date?.toDateString(), // Safely access 'date' and call 'toDateString()' if it exists
                        posts: dayGroup.posts
                    };
                });

                const isNFTPresentForLast7Days = daysInLastWeek.every((day) =>
                    nftsLast7Days.some((dayGroup) => dayGroup.date === day)
                );
                nftsLast7DaysVar = nftsLast7Days;
                isNFTs = isNFTPresentForLast7Days;

                console.log('Posts in the last 7 days:', nftsLast7Days);
                console.log(
                    'Posts present for each day:',
                    isNFTPresentForLast7Days
                );
            })
            .catch((err) => {
                console.error('Error occurred:', err);
            });
        if (user?.createdAt) {
            const currentDate = new Date();
            const createdAt = new Date(user.createdAt);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const timeDifference = currentDate - createdAt;
            daysSpent = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        } else {
            daysSpent = 60;
        }

        console.log({ collections }, 'collections');

        return {
            isdays: daysSpent >= 7,
            days: daysSpent,
            followers: user.followers.length,
            isfollowers: user.followers.length >= 100,
            iscollection: collections.length >= 1,
            isNFTs,
            nftsLast7Days: nftsLast7DaysVar
        };
    }

    async applyForSCCApprovel(userId: Types.ObjectId): Promise<SuccessPayload> {
        const result = await this.contentCreatorStats(userId);
        if (result) {
            const { isdays, isfollowers, iscollection, nftsLast7Days } = result;
            if (
                isdays &&
                isfollowers &&
                iscollection &&
                nftsLast7Days.length >= 7
            ) {
                await this.userModel.findByIdAndUpdate(userId, {
                    $set: {
                        scc_status: 'PENDING'
                    }
                });
                return { message: 'Applied successfully', success: true };
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    async SCCApprovel(userId: Types.ObjectId) {
        const result = await this.contentCreatorStats(userId);
        if (result) {
            const { isdays, isfollowers, iscollection, nftsLast7Days } = result;
            if (
                isdays &&
                isfollowers &&
                iscollection &&
                nftsLast7Days.length >= 7
            ) {
                await this.userModel.findByIdAndUpdate(userId, {
                    $set: {
                        isSCC: true,
                        scc_status: 'APPROVED'
                    }
                });
                await this.notificationModel.create({
                    type: NotificationType.SYSTEM,
                    sender: ENotificationFromType.APP,
                    message: 'You have become a Content Creater Badge!',
                    receiver: result[0]?._id
                });
                return { message: 'Applied successfully', success: true };
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    async SCCAppliedUsers() {
        return this.userModel.find({ isSCC: false, scc_status: 'PENDING' });
    }

    async getLinkPreview(userName: string): Promise<{ link_preview: string }> {
        const user = await this.userModel.findOne({ userName });
        const name = `${user?.firstName} ${user?.lastName} (@${user?.userName})`;
        const defaultAvatar =
            'https://res.cloudinary.com/dq3jqnrem/image/upload/v1692805850/ymvgxht0vvmqfikqh5ib.jpg';

        // const userStats = await this.nftService.userStats(user._id);

        const preview = await generateOGImage(
            'user',
            name,
            user?.avatar || defaultAvatar,
            user?.bio || '',
            '',
            user?.followersCount || 0,
            user?.followingCount || 0,
            0, // minted value
            0, // listed value
            0, // bought value
            0 // sold value
        );
        return { link_preview: preview };
    }

    // --------------- USERS SETTINGS -----------------

    async isUserSettingEnabled(
        id: string | Types.ObjectId,
        settingType: string
    ) {
        const user = await this.userModel.findById(id).exec();
        const settingKeys = settingType.split('.');
        const isSettingEnabled = settingKeys.reduce(
            (obj, key) => obj?.[key],
            user?.settings
        );
        return !!isSettingEnabled;
    }

    async getLeaders() {
        try {
            const leaders = await this.postModel
                .aggregate([
                    {
                        $match: {
                            $and: [
                                { tokenData: { $exists: true } },
                                {
                                    $or: [
                                        { token: null },
                                        { token: { $exists: false } }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        $group: {
                            _id: '$author',
                            tokenContractCount: {
                                $sum: 1
                            }
                        }
                    },
                    {
                        $sort: {
                            tokenContractCount: -1
                        }
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
                            _id: 1,
                            tokenContractCount: 1,
                            user: {
                                $arrayElemAt: ['$user', 0]
                            }
                        }
                    },
                    {
                        $limit: 5
                    }
                ])
                .exec();

            return leaders;
        } catch (error) {
            console.log(error);
        }
    }
}
