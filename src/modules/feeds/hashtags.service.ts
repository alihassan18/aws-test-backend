import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../users/entities/user.entity';
import { Post, PostDocument } from './entities/post.entity';
import { Feed, FeedDocument } from './entities/feed.entity';
import { Hashtag, HashtagDocument } from './entities/hashtag.entity';
import { USERS } from 'src/constants/db.collections';
import { HashtagCount } from './entities/hashcount.entity';

@Injectable()
export class HashtagsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(Feed.name) private feedModel: Model<FeedDocument>,
        @InjectModel(Hashtag.name) public hashtagModel: Model<HashtagDocument>,
        @InjectModel(USERS) private userModel: Model<UserDocument> // @Inject(forwardRef(() => PublicFeedsGateway)) // private publicFeedsGateway: PublicFeedsGateway
    ) {}

    async searchHashtags(query: string): Promise<Hashtag[]> {
        return this.hashtagModel
            .find({ name: { $regex: `^${query}`, $options: 'i' } })
            .limit(3)
            .sort({ followersCount: -1 })
            .exec();
    }

    async findHashtagByName(name: string): Promise<HashtagDocument> {
        return this.hashtagModel.findOne({ name }).exec();
    }

    async findOrCreateMany(hashtags: string[]): Promise<Hashtag[]> {
        const foundOrCreatePromises = hashtags.map(async (name) => {
            const existingHashtag = await this.hashtagModel
                .findOne({ name })
                .exec();
            if (existingHashtag) {
                return existingHashtag;
            }
            const newHashtag = new this.hashtagModel({ name });
            return newHashtag.save();
        });

        return Promise.all(foundOrCreatePromises);
    }
    async findAll(
        query?: FilterQuery<HashtagDocument>
    ): Promise<HashtagDocument[]> {
        return this.hashtagModel.find(query).exec();
    }

    async findHashtagById(id: Types.ObjectId) {
        return this.hashtagModel.findById(id);
    }

    async findHashtags(
        query: FilterQuery<HashtagDocument>
    ): Promise<HashtagDocument[]> {
        return this.hashtagModel.find(query);
    }

    async followHashtag(
        tagId: Types.ObjectId,
        userId: Types.ObjectId
    ): Promise<UserDocument> {
        const session = await this.hashtagModel.db.startSession();
        session.startTransaction();
        try {
            const hashtag = await this.hashtagModel
                .findOne({ _id: tagId })
                .session(session)
                .lean()
                .exec();

            if (!hashtag) {
                throw new NotFoundException('Hashtag not found');
            }

            const isFollower =
                hashtag?.followers?.filter(
                    (el) => el.toString() == userId.toString()
                ).length > 0;

            const updateOperation = isFollower ? '$pull' : '$addToSet';
            const countModifier = isFollower ? -1 : 1;

            await this.hashtagModel
                .findByIdAndUpdate(
                    tagId,
                    {
                        [updateOperation]: {
                            followers: userId
                        },
                        $inc: {
                            followersCount: countModifier
                        }
                    },
                    { session }
                )
                .exec();

            const updatedUser = await this.userModel
                .findByIdAndUpdate(
                    userId,
                    {
                        [updateOperation]: {
                            followingHashtags: tagId
                        }
                    },
                    {
                        new: true
                    }
                )
                .populate('followingHashtags');

            await session.commitTransaction();

            return updatedUser;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async findTopHashtags(limit: number): Promise<Hashtag[]> {
        const topHashtags = await this.hashtagModel
            .find()
            .sort({ followersCount: -1 })
            .limit(limit)
            .exec();

        return topHashtags;
    }

    async findTopHashtagsQ(
        days: number,
        limit: number,
        query?: string
    ): Promise<HashtagCount[]> {
        const previousDay = new Date();
        previousDay.setDate(previousDay.getDate() - (days > 0 ? days : 100000));

        const topLast24HoursHashtags = await this.postModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: previousDay
                    },
                    'hashtags.0': {
                        $exists: true
                    }
                }
            },
            {
                $lookup: {
                    from: 'hashtags',
                    localField: 'hashtags',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $regexMatch: {
                                        input: '$name',
                                        regex: query,
                                        options: 'i'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                name: 1
                            }
                        }
                    ],
                    as: 'hashtagsObj'
                }
            }
        ]);

        const hashCount: { [key: string]: number } = {};

        const hastTagsToLooup = [];
        const hastagNamesById: { [key: string]: string } = {};
        topLast24HoursHashtags.forEach((post) => {
            post.hashtagsObj.forEach((ht) => {
                const x_name = ht.name.toString();
                if (!hastagNamesById[ht._id.toString()]) {
                    hastTagsToLooup.push(ht._id);
                    hastagNamesById[ht._id.toString()] = x_name;
                }
            });
        });

        const seaerchByHash = await this.postModel.aggregate([
            {
                $match: {
                    hashtags: {
                        $in: hastTagsToLooup
                    }
                }
            },
            {
                $lookup: {
                    from: 'hashtags',
                    localField: 'hashtags',
                    foreignField: '_id',
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $regexMatch: {
                                        input: '$name',
                                        regex: query,
                                        options: 'i'
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                name: 1
                            }
                        }
                    ],
                    as: 'hashtagsObj'
                }
            },
            {
                $addFields: {
                    hashtagsCount: { $size: '$hashtags' } // Calculate the length of the arrayField
                }
            },
            {
                $sort: { hashtagsCount: -1 }
            }
        ]);

        seaerchByHash.forEach((post) => {
            post.hashtagsObj.forEach((ht) => {
                const x_name = ht.name.toString();
                if (!hashCount[x_name]) {
                    hashCount[x_name] = 0;
                }
                hashCount[x_name]++;
            });
        });

        const topRecords = Object.entries(hashCount)
            .sort(([, a], [, b]) => {
                return b - a;
            })
            .map(([key, value]) => {
                if (value != 0) return { name: key, count: value };
            });

        return limit > 0 ? topRecords.slice(0, limit) : topRecords;
    }

    async findTopHashtagsByDays(limit?) {
        const last24hrs = new Date();
        last24hrs.setDate(last24hrs.getDate() - 1);
        // const aggregatedHashtags = await this.feedModel.aggregate([
        //     {
        //         $match: {
        //             createdAt: { $gte: last24hrs },
        //             hashtags: { $ne: null }
        //         }
        //     },
        //     {
        //         $unwind: '$hashtags'
        //     },
        //     {
        //         $group: {
        //             _id: '$hashtags',
        //             count: { $sum: 1 }
        //         }
        //     },
        //     {
        //         $sort: { count: -1 }
        //     },
        //     {
        //         $limit: 24 // Get the top 24 hashtags
        //     }
        // ]);

        const aggregatedHashtags = await this.feedModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: last24hrs },
                    hashtags: { $ne: null }
                }
            },
            {
                $unwind: '$hashtags'
            },
            {
                $group: {
                    _id: '$hashtags',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: limit ? Number(limit) : 24 // Get the top 24 hashtags
            },
            {
                $lookup: {
                    from: 'hashtags',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'hashtag'
                }
            },
            {
                $unwind: '$hashtag'
            },
            {
                $project: {
                    _id: '$hashtag._id',
                    name: '$hashtag.name',
                    count: 1
                }
            }
        ]);

        return aggregatedHashtags;
    }
    /*
    async findTopLast24HoursHashtags(limit: number): Promise<Hashtag[]> {
        const previousDay = new Date();
        previousDay.setDate(previousDay.getDate() - 1);
        const topLast24HoursHashtags = await this.hashtagModel
            .find({
                createdAt: { $gte: previousDay },
                followersCount: { $gt: 0 }
            })
            .sort({ followersCount: -1 })
            .limit(limit)
            .exec();

        return topLast24HoursHashtags;
    }*/

    async usersUseHashtag(hashtagName: string): Promise<PostDocument[]> {
        const hashtag: HashtagDocument = await this.hashtagModel.findOne({
            name: hashtagName
        });

        const last24hrs = new Date();
        last24hrs.setDate(last24hrs.getDate() - 1);

        // const postss = await this.postModel.find( {
        //     hashtags: { $in: [hashtag._id] },
        //     createdAt: { $gte: last24hrs }
        // }).distinct("owner").select('author').sort({_id:-1});

        const ID = new Types.ObjectId(hashtag._id);
        const posts = await this.postModel.aggregate([
            {
                $match:
                    /**
                     * query: The query in MQL.
                     */
                    {
                        hashtags: {
                            $in: [ID]
                        }
                    }
            }
        ]);
        console.log(posts, 'postspostsposts', hashtag);

        return posts;
    }

    async hashtagFollowersUsers(hash: string) {
        const bannedUsers = await this.userModel
            .find({ isBanned: true })
            .select('_id');
        const bannedIds = bannedUsers.map((user) => user._id);
        const hashtag: HashtagDocument = await this.hashtagModel.findOne({
            name: hash
        });

        const users = await this.userModel
            .find({
                followingHashtags: { $in: [hashtag._id] },
                _id: { $nin: bannedIds }
            })
            .sort({ followersCount: -1 });
        return users;
    }
}
