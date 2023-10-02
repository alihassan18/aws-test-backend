import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { FeedFilterInput, LinkPreviewResult } from './dto/create-feed.input';
import { FilterQuery, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Post, PostDocument } from './entities/post.entity';
import { Feed, FeedDocument } from './entities/feed.entity';
import { Hashtag, HashtagDocument } from './entities/hashtag.entity';
import { PublicFeedsGateway } from '../gateways/public/public-feeds.gateway';
import { COLLECTIONS, USERS } from 'src/constants/db.collections';
import { FeedTypes } from './feeds.enums';
import axios from 'axios';
import cheerio from 'cheerio';
import { CollectionDocument } from '../collections/entities/collection.entity';
import { PrivateFeedsGateway } from '../gateways/private/private-feeds.gateway';
import { ScoresService } from '../scores/scores.service';
import { NotificationService } from '../notifications/notification.service';
import {
    ENotificationFromType,
    NotificationType
} from '../notifications/notifications.enum';
import { EmailService } from '../shared/services/email.service';
// import { GET_DELETED_POST } from 'src/constants/socket.constants';

@Injectable()
export class FeedsService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(Feed.name) public feedModel: Model<FeedDocument>,
        @InjectModel(Hashtag.name) private hashtagModel: Model<HashtagDocument>,
        @InjectModel(COLLECTIONS)
        private readonly collectionModel: Model<CollectionDocument>,
        @InjectModel(USERS) private userModel: Model<UserDocument>,
        private userService: UsersService,
        @Inject(forwardRef(() => PublicFeedsGateway))
        private publicFeedsGateway: PublicFeedsGateway,
        @Inject(forwardRef(() => PrivateFeedsGateway))
        private privateFeedsGateway: PrivateFeedsGateway,
        private scoresService: ScoresService,
        private notificationService: NotificationService,
        private emailService: EmailService
    ) {}

    async createFeed(data: Partial<FeedDocument>) {
        const feed = await this.feedModel.create({ ...data });
        this.publicFeedsGateway.emitFeeds(feed._id);
        return feed;
    }

    findById(id: Types.ObjectId): Promise<PostDocument> {
        return this.feedModel.findById(id);
    }

    async remove(feedId: Types.ObjectId, userId: Types.ObjectId) {
        const feed = await this.feedModel.findById(feedId);
        if (!feed) {
            throw new Error('This post is not exists.');
        }
        if (feed.owner.toString() !== userId.toString()) {
            throw new Error('You are not the owner of this post.');
        }
        return this.feedModel.findByIdAndDelete(feedId);
    }

    async getUserFeed(userId: Types.ObjectId): Promise<PostDocument[]> {
        const user: User = await this.userService.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const followingIds = user.following.map((user) => user._id);

        const tweetsWithQuotedAndRetweeted = await this.postModel
            .aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author'
                    }
                },
                {
                    $unwind: '$author'
                },
                {
                    $lookup: {
                        from: 'posts',
                        localField: 'originalPost',
                        foreignField: '_id',
                        as: 'originalPost'
                    }
                },
                {
                    $unwind: {
                        path: '$originalPost',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'originalPost.author',
                        foreignField: '_id',
                        as: 'originalPost.author'
                    }
                },
                {
                    $unwind: {
                        path: '$originalPost.author',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $match: {
                        $or: [
                            { author: { $in: followingIds } },
                            { author: userId },
                            { 'originalPost.author': { $in: followingIds } },
                            {
                                retweetedBy: {
                                    $elemMatch: { $in: followingIds }
                                }
                            }
                        ]
                    }
                }
            ])
            .exec();

        // Transform _id from ObjectId to string
        const transformedTweets = tweetsWithQuotedAndRetweeted.map((tweet) => {
            return { ...tweet, _id: tweet._id.toString() };
        });

        return transformedTweets;
    }

    async findAllFeeds(
        queryy: FilterQuery<FeedFilterInput>,
        limit: number,
        cursor?: string,
        loggedUserId?: string
    ): Promise<{
        records: FeedDocument[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
    }> {
        const bannedUsers = await this.userService.allBannedUsers();

        let user: UserDocument;
        if (queryy?.follow && queryy?.owner) {
            user = await this.userModel.findById(queryy?.owner).exec();
        }
        const followingUsers = user?.following;
        const followingCollections = user?.followingCollections;
        const followingHashtags = user?.followingHashtags;

        let query = {};
        if (user) {
            query = {
                $or: [
                    { owner: { $in: followingUsers } },
                    { _collection: { $in: followingCollections } },
                    { hashtags: { $in: followingHashtags } }
                ]
            };
        }
        if (queryy?.owner && !queryy?.follow) {
            query = {
                $or: [{ owner: new Types.ObjectId(queryy?.owner) }]
            };
        }
        if (!queryy?.follow && !queryy?.owner) {
            query = {
                $or: [{ type: FeedTypes.POST }, { type: FeedTypes.REPOST }]
            };
        }
        if (queryy?.collection) {
            query = {
                $or: [{ _collection: new Types.ObjectId(queryy?.collection) }]
            };
        }

        if (loggedUserId) {
            const user = await this.userModel.findById(loggedUserId).exec();

            query['owner'] = { $nin: user?.blockedUsers };
        }

        if (cursor) {
            query['_id'] = { $lt: new Types.ObjectId(cursor) };
        }
        query['$or'] = [
            ...(query['$or'] || []) // include existing conditions, if any
            // { scheduledAt: { $exists: false } },
            // { scheduledAt: { $lte: new Date() } }
        ];
        query['$and'] = [
            ...(query['$and'] || []), // include existing conditions, if any
            {
                $or: [
                    { scheduledAt: { $exists: false } },
                    { scheduledAt: { $lte: new Date() } }
                ]
            },
            {
                $or: [
                    // Include existing conditions, if any
                    ...(query['$or'] || []),
                    // Add more conditions as needed
                    { owner: { $ne: { $ifNull: ['$isBanned', false] } } }
                ],
                owner: {
                    ...query['$or']?.find((c) => c.owner)?.owner,
                    $nin: bannedUsers // Use the array of banned user IDs here
                }
            }
        ];

        const feeds = await this.feedModel
            .find(query)
            .sort({ _id: -1 })
            .limit(limit + 1)
            .exec();

        const hasNextPage = feeds.length > limit;
        const edges = hasNextPage ? feeds.slice(0, -1) : feeds;
        const endCursor = hasNextPage
            ? edges[edges.length - 1]._id.toString()
            : null;

        return {
            records: edges,
            pageInfo: {
                hasNextPage,
                endCursor
            }
        };
    }

    /* FOR SOCKET */

    findFeedByIdP(id: Types.ObjectId): Promise<PostDocument> {
        return this.feedModel
            .findById(id)
            .populate({
                path: 'owner',
                select: '_id firstName lastName userName avatar isVerified'
            })
            .populate({
                path: 'post',
                populate: [
                    {
                        path: 'author',
                        select: '_id firstName lastName userName avatar isVerified'
                    },
                    {
                        path: 'hashtags',
                        select: '_id name followersCount',
                        model: this.hashtagModel
                    },
                    {
                        path: 'collectionOfToken',
                        select: '_id name description contract chain image banner volume_total floor_price',
                        model: this.collectionModel
                    },
                    {
                        path: '_collection',
                        select: ' _id name floor_price volume_total contract image contract_name description banner chain followers token_count supply owners_total',
                        model: this.collectionModel
                    },
                    {
                        path: 'mrland',
                        select: ' _id name  landID network description owner isPlot logo'
                    },
                    {
                        path: 'originalPost',
                        populate: [
                            {
                                path: 'author',
                                select: '_id firstName lastName userName avatar isVerified'
                            },
                            {
                                path: 'collectionOfToken',
                                select: '_id name description contract chain image banner volume_total floor_price',
                                model: this.collectionModel
                            },
                            {
                                path: '_collection',
                                select: ' _id name floor_price volume_total contract image contract_name description banner chain followers token_count supply owners_total',
                                model: this.collectionModel
                            },
                            {
                                path: 'mrland',
                                select: ' _id name  landID network description owner isPlot logo'
                            }
                        ]
                    },
                    {
                        path: 'inReplyToPost',
                        populate: [
                            {
                                path: 'author',
                                select: '_id firstName lastName userName avatar isVerified'
                            },
                            {
                                path: 'collectionOfToken',
                                select: '_id name description contract chain image banner volume_total floor_price',
                                model: this.collectionModel
                            },
                            {
                                path: '_collection',
                                select: ' _id name floor_price volume_total contract image contract_name description banner chain followers token_count supply owners_total',
                                model: this.collectionModel
                            },
                            {
                                path: 'mrland',
                                select: ' _id name  landID network description owner isPlot logo'
                            }
                        ]
                    }
                ]
            });
    }

    // ----- LINK PREVIRE -----

    async linkPreview(link: string): Promise<LinkPreviewResult> {
        const checkUrl = link.includes('https://') ? link : 'https://' + link;
        const response = await axios.get(checkUrl, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            }
        });
        const $ = cheerio.load(response.data);

        // Extract the relevant information from the HTML
        const title = $('head title').text();
        const description = $('head meta[name="description"]').attr('content');
        const imageUrl = $('head meta[property="og:image"]').attr('content');
        return { url: checkUrl, title, description, imageUrl };
    }

    // ---------- USER FOLLOW HERE DUE TO PRIVATE GATEWAY ISSUE

    async follow(otherUser, userId) {
        const following = await this.userModel
            .findOne({ _id: otherUser })
            .lean()
            .exec();

        const isFollower =
            following?.followers?.filter((el) => el.toString() == userId)
                .length > 0;
        await this.scoresService.createScore(
            otherUser,
            isFollower ? 'unfollowers' : 'followers'
        );
        const newFollowersCount = isFollower
            ? Number(following.followersCount || 0) - 1
            : Number(following.followersCount || 0) + 1;

        const followersTimestamps = {
            by: userId,
            createdAt: new Date()
        };
        await this.userModel
            .findByIdAndUpdate(otherUser, {
                [isFollower ? '$pull' : '$addToSet']: {
                    followers: userId,
                    followersTimestamps: isFollower
                        ? { by: userId }
                        : followersTimestamps
                },
                followersCount: newFollowersCount
            })
            .exec();

        // this.publicUserGateway.emitUserUpdated(
        //     { followersCount: newFollowersCount },
        //     otherUser
        // );
        if (!isFollower) {
            /* Notification */
            // if (userId.toString() !== otherUser.toString()) {
            //     this.notificationService.create({
            //         type: NotificationType.COMMENT,
            //         sender: ENotificationFromType.USER,
            //         from: userId,
            //         receiver: otherUser,
            //     });
            // }
        }
        const user = await this.userModel
            .findOne({ _id: userId })
            .lean()
            .select({ password: 0, email: 0, key: 0 })
            .exec();
        if (!isFollower) {
            if (userId.toString() !== otherUser.toString()) {
                this.notificationService.create({
                    type: NotificationType.FOLLOW,
                    sender: ENotificationFromType.USER,
                    from: userId,
                    receiver: new Types.ObjectId(otherUser)
                });

                this.emailService.sendFollowEmail(
                    following.email,
                    `${user.userName}`,
                    user.avatar,
                    `${process.env.FRONT_BASE_URL}/@${user.userName}`
                );
            }
        }

        const isFollowed =
            user?.following?.filter((el) => el.toString() == otherUser).length >
            0;
        await this.scoresService.createScore(
            userId,
            isFollowed ? 'unfollow' : 'follow'
        );

        const followingTimestamps = {
            by: new Types.ObjectId(otherUser),
            createdAt: new Date()
        };
        const updatedUser = await this.userModel
            .findByIdAndUpdate(
                userId,
                {
                    [isFollowed ? '$pull' : '$addToSet']: {
                        following: otherUser,
                        followingTimestamps: isFollowed
                            ? { by: new Types.ObjectId(otherUser) }
                            : followingTimestamps
                    },
                    followingCount: isFollowed
                        ? Number(user.followingCount || 0) - 1
                        : Number(user.followingCount || 0) + 1
                },
                {
                    new: true
                }
            )
            .select({ password: 0, email: 0, key: 0 })
            .populate('followers')
            .populate('following')
            .populate('followingHashtags');

        return updatedUser;
    }
}
