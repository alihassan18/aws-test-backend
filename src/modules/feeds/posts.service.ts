import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
    forwardRef
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { ContractsData, Post, PostDocument } from './entities/post.entity';
import {
    CreateCollectionPostInput,
    CreatePostInput,
    CreateRePostInput,
    PaginatedResults,
    PostFilterInput
} from './dto/create-feed.input';
import { HashtagDocument } from './entities/hashtag.entity';
import { HashtagsService } from './hashtags.service';
import { FeedsService } from './feeds.service';
import { FeedTypes } from './feeds.enums';
import { PublicFeedsGateway } from '../gateways/public/public-feeds.gateway';
import { FeedDocument } from './entities/feed.entity';
import {
    CollectionInput,
    StageInput,
    TokenInput,
    QueryOfDuplicateC,
    UpdateFeedInput,
    UpdateNftForPost
} from './dto/update-feed.input';
import { PaginationOptions } from 'src/interfaces/common.interface';
import { NotificationService } from '../notifications/notification.service';
import {
    ENotificationFromType,
    NotificationType
} from '../notifications/notifications.enum';
import {
    convertMarkupToString,
    extractMentionsAndHashtags
} from 'src/helpers/common.helpers';
import { PollOptionDocument } from './entities/poll.entity';
import { TwitterApi } from 'twitter-api-v2';
import * as path from 'path';
import * as fs from 'fs';
import * as https from 'https';
import { LinkedinService } from '../social/linkedin.service';
import { User, UserDocument } from '../users/entities/user.entity';
import { ScoresService } from '../scores/scores.service';
// import { Collection, CollectionDocument } from '../collections/entities/collection.entity';
import { Nft, NftDocument } from '../nfts/entities/nft.entity';
import { UsersService } from '../users/users.service';
import { CollectionsService } from '../collections/collections.service';
import {
    StakingCollection,
    StakingCollectionDocument
} from '../staking/entities/collection.staking.entity';
import { EmailService } from '../shared/services/email.service';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(StakingCollection.name)
        private stakingCollectionModel: Model<StakingCollectionDocument>,
        public hashtagsService: HashtagsService,
        public userService: UsersService,
        private readonly scoresService: ScoresService,
        private feedsService: FeedsService,
        private linkedinService: LinkedinService,
        private notificationService: NotificationService,
        @InjectModel(Nft.name)
        private tokenModel: Model<NftDocument>,
        @Inject(forwardRef(() => PublicFeedsGateway))
        private publicFeedsGateway: PublicFeedsGateway,
        @Inject(forwardRef(() => CollectionsService))
        private collectionServivce: CollectionsService,
        private emailService: EmailService
    ) {}

    async findById(id: Types.ObjectId): Promise<Post> {
        return this.postModel.findById(id).exec();
    }

    async update(
        id: Types.ObjectId,
        userId: Types.ObjectId,
        updateData: UpdateFeedInput
    ): Promise<Post> {
        const post = await this.postModel.findById(id).exec();
        if (!post) {
            throw new NotFoundException('Post not found');
        }

        if (post.author.toString() !== userId.toString()) {
            throw new ForbiddenException(
                'You are not authorized to update this post'
            );
        }

        const updatedPost = Object.assign(post, updateData);
        return updatedPost.save();
    }

    async delete(id: string): Promise<Post> {
        const post = await this.postModel.findByIdAndDelete(id).exec();
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        return post;
    }

    async findReplies(
        postId: Types.ObjectId,
        paginationOptions: PaginationOptions,
        loggedUserId?: string
    ): Promise<PaginatedResults> {
        const { limit = 10, cursor } = paginationOptions;
        const bannedUsers = await this.userService.allBannedUsers();

        const filter = { inReplyToPost: postId, author: { $nin: bannedUsers } };

        if (cursor) {
            filter['_id'] = { $lt: cursor };
        }
        if (loggedUserId) {
            const user = await this.userModel.findById(loggedUserId).exec();

            filter['author'] = { $nin: [...user.blockedUsers, ...bannedUsers] };
        }

        const replies = await this.postModel
            .find(filter)
            .limit(limit + 1)
            .sort({ _id: -1 });
        const hasNextPage = replies.length > limit;
        const edges = hasNextPage ? replies.slice(0, -1) : replies;

        const totalCount = await this.postModel.countDocuments(filter);

        return {
            records: edges,
            hasNextPage,
            cursor: hasNextPage ? edges[edges.length - 1]._id : null,
            totalCount
        };
    }

    async findRetweets(postId: Types.ObjectId): Promise<Post[]> {
        return this.postModel
            .find({ originalPost: postId, isRepost: true })
            .exec();
    }

    async findByUser(userId: Types.ObjectId): Promise<Post[]> {
        return this.postModel.find({ author: userId }).exec();
    }

    async getChildTweets(postId: Types.ObjectId): Promise<Post[]> {
        return this.postModel.find({ inReplyToPost: postId }).exec();
    }

    async getParentTweet(postId: Types.ObjectId): Promise<Post | null> {
        const post = await this.findById(postId);
        if (post.inReplyToPost) {
            return this.findById(post.inReplyToPost);
        }
        return null;
    }

    async findCollectionPost(
        contract: string,
        chain
        // name?: string,
        // image?: string
    ) {
        let post = await this.postModel
            .findOne({
                'collectionData.contract': contract,
                'collectionData.chain': chain
            })
            .exec();
        if (!post) {
            const collection =
                await this.collectionServivce.findByAddressAndChain(
                    contract,
                    chain
                );
            post = await this.postModel.create({
                author: collection?.creator,
                collectionData: {
                    chain: chain,
                    contract: contract?.toLowerCase(),
                    name: collection?.name,
                    image: collection?.image,
                    banner: collection?.banner
                }
            });
        }
        return post;
    }

    async findNftPost(contract, chain, tokenId) {
        let post = await this.postModel.findOne({
            $or: [
                {
                    'tokenData.contract': { $regex: new RegExp(contract, 'i') },
                    'tokenData.chain': chain,
                    'tokenData.tokenId': tokenId
                },
                {
                    'token.contract': { $regex: new RegExp(contract, 'i') },
                    'token.chain': chain,
                    'token.tokenId': tokenId
                }
            ]
        });
        // console.log(post, 'post', contract, chain, tokenId);

        if (!post) {
            const collection =
                await this.collectionServivce.findByAddressAndChain(
                    contract,
                    chain
                );
            post = await this.postModel.create({
                author: collection?.creator,
                tokenData: {
                    chain: chain,
                    contract: contract?.toLowerCase(),
                    tokenId: tokenId
                    // name,
                    // image
                }
            });
        }
        return post;
    }

    async createCustom(
        createPostInput: CreatePostInput,
        userId: Types.ObjectId,
        type: string,
        id: string
    ) {
        if (!type || !id) throw new Error('type and id required');

        const post = await this.postModel.create({
            ...createPostInput,
            author: userId,
            ...(type === 'STAKING_COLLECTION' && {
                staking: new Types.ObjectId(id)
            })
        });

        if (type === 'STAKING_COLLECTION') {
            const stakingCollection = await this.stakingCollectionModel.findOne(
                {
                    _id: new Types.ObjectId(id)
                }
            );
            if (!stakingCollection?.post) {
                await stakingCollection.updateOne({
                    post: post._id
                });
            }
        }

        return post;
    }

    async create(
        createPostInput: CreatePostInput,
        owner: UserDocument,
        collectionData: CreateCollectionPostInput // to create new comment for a collection (To show NFT card)
    ) {
        const userId: Types.ObjectId = owner._id;
        const { hashtags, mentions } = extractMentionsAndHashtags(
            createPostInput.text
        );
        let hashtagss: HashtagDocument[] = [];
        if (hashtags?.length > 0) {
            const tags = await this.hashtagsService.findOrCreateMany(
                hashtags.map((item) => item.tag),
                !createPostInput.originalPost && !createPostInput.inReplyToPost
                    ? true
                    : false
            );
            hashtagss = tags;
        }

        const inReplyToPost = createPostInput.inReplyToPost
            ? new Types.ObjectId(createPostInput.inReplyToPost)
            : null;

        const originalPost = createPostInput.originalPost
            ? new Types.ObjectId(createPostInput.originalPost)
            : null;

        const post = await this.postModel.create({
            ...createPostInput,
            author: userId,
            inReplyToPost,
            originalPost,
            ...(mentions.length > 0 && {
                mentions: mentions.map((item) => item.id)
            }),
            ...(hashtagss.length > 0 && {
                hashtags: hashtagss.map((item) => item?._id)
            }),
            ...(createPostInput.twitter && {
                twitterPost: true
            }),
            ...(createPostInput.linkedin && {
                linkedinPost: true
            }),
            ...(createPostInput.facebook && {
                facebookPost: true
            }),
            ...(createPostInput.instagram && {
                instagramPost: true
            }),
            ...(createPostInput?._collection && {
                _collection: new Types.ObjectId(createPostInput?._collection)
            })
        });

        // if (hashtagss.length > 0) {
        //     for (const hashtag of hashtagss.filter(
        //         (x) => x.followers.length > 0
        //     )) {
        //         for (const follower of hashtag.followers) {
        //             /* Notification */
        //             if (userId.toString() !== follower.toString()) {
        //                 this.notificationService.create({
        //                     type: NotificationType.HASHTAG,
        //                     sender: ENotificationFromType.USER,
        //                     from: userId,
        //                     receiver: follower,
        //                     post: post?._id
        //                 });
        //             }
        //         }
        //     }
        // }
        await this.feedsService.createFeed({
            post: post?._id,
            type: createPostInput.inReplyToPost
                ? FeedTypes.COMMENT
                : createPostInput.originalPost
                ? FeedTypes.REPOST
                : FeedTypes.POST,
            owner: userId,
            ...(createPostInput?.scheduledAt && {
                scheduledAt: createPostInput.scheduledAt
            }),
            ...(createPostInput?._collection && {
                _collection: new Types.ObjectId(createPostInput?._collection)
            }),
            ...(hashtagss.length > 0 && {
                hashtags: hashtagss.map((item) => item?._id)
            })
        });

        if (collectionData) {
            const collectionPost = await this.postModel.findOne({
                'collectionData.contract': collectionData?.contract,
                'collectionData.chain': collectionData?.chain
            });

            if (collectionPost) {
                await this.postModel.create({
                    ...createPostInput,
                    author: userId,
                    inReplyToPost: collectionPost._id,
                    originalPost,
                    ...(mentions.length > 0 && {
                        mentions: mentions.map((item) => item.id)
                    }),
                    ...(hashtagss.length > 0 && {
                        hashtags: hashtagss.map((item) => item?._id)
                    }),
                    ...(createPostInput.twitter && {
                        twitterPost: true
                    }),
                    ...(createPostInput.linkedin && {
                        linkedinPost: true
                    }),
                    ...(createPostInput.facebook && {
                        facebookPost: true
                    }),
                    ...(createPostInput.instagram && {
                        instagramPost: true
                    }),
                    ...(createPostInput?._collection && {
                        _collection: new Types.ObjectId(
                            createPostInput?._collection
                        )
                    }),
                    ...(collectionData && {
                        // For showing token card in collection's comment
                        tokenData: collectionData
                    })
                });
                await this.postModel
                    .findByIdAndUpdate(
                        collectionPost._id,
                        {
                            $addToSet: {
                                viewedBy: userId,
                                commentsBy: userId
                            },
                            $inc: { commentsCount: 1 }
                        },
                        { new: true }
                    )
                    .exec();
            } else {
                await this.postModel.create({
                    collectionData: {
                        chain: collectionData?.chain,
                        contract: collectionData?.contract
                    },
                    tokenData: {
                        chain: collectionData?.chain,
                        contract: collectionData?.contract,
                        tokenId: collectionData?.tokenId
                    },
                    inReplyToPost: post._id
                });
            }
        }

        /* Increase minted count if user posted a token */
        if (createPostInput?.tokenData?.isMinted) {
            await this.userModel
                .findByIdAndUpdate(
                    userId,
                    {
                        $inc: { minted: 1 }
                    },
                    { new: true }
                )
                .exec();
        }

        const repliedOnPost = await this.postModel
            .findById(createPostInput.inReplyToPost)
            .exec();

        if (createPostInput.inReplyToPost) {
            const feed = await this.postModel
                .findByIdAndUpdate(
                    createPostInput.inReplyToPost,
                    {
                        $addToSet: {
                            viewedBy: userId,
                            commentsBy: userId
                        },
                        $inc: { commentsCount: 1 }
                    },
                    { new: true }
                )
                .exec();

            // emit comment counts socket
            this.publicFeedsGateway.emitCommentCountOnPost({
                postId: createPostInput.inReplyToPost.toString(),
                commentCounts: feed?.commentsCount || 0
            });

            /* Notification */
            if (userId.toString() !== repliedOnPost?.author?.toString()) {
                this.notificationService.create({
                    type: createPostInput.originalPost
                        ? NotificationType.COMMENT_REPLY
                        : NotificationType.COMMENT,
                    sender: ENotificationFromType.USER,
                    from: userId,
                    receiver: repliedOnPost.author,
                    post: repliedOnPost?._id
                });

                const receiver = await this.userModel.findById(
                    repliedOnPost.author
                );

                // email service
                if (
                    createPostInput.inReplyToPost &&
                    !createPostInput.originalPost
                ) {
                    // simple comment on post

                    if (receiver) {
                        this.emailService.sendCommentEmail(
                            receiver?.email,
                            `${owner.userName}`,
                            post.text,
                            `${process.env.FRONT_BASE_URL}/feeds/${post._id}`
                        );
                    }
                } else if (
                    createPostInput.inReplyToPost &&
                    createPostInput.originalPost
                ) {
                    const receiver = await this.userModel.findById(
                        repliedOnPost.author
                    );
                    if (receiver) {
                        this.emailService.sendCommentReplyEmail(
                            receiver?.email,
                            `${owner.userName}`,
                            owner.avatar,
                            `${process.env.FRONT_BASE_URL}/feeds/${post._id}`
                        );
                    }

                    // comment reply
                    // for repost -> instant repost
                }
                // notification for all followers
                this.notificationService.alertFollowers4Comment(
                    userId,
                    owner.userName,
                    post._id,
                    post.text,
                    [receiver.email],
                    [receiver._id.toString()]
                );
            }

            //Add mintstargram score for comment
            if (repliedOnPost) {
                await this.scoresService.createScore(userId, 'comment');
            }
        }

        if (createPostInput.originalPost) {
            // Increment repostCount and add the userId to postedBy array
            const originalPostt = await this.postModel
                .findByIdAndUpdate(
                    createPostInput?.originalPost,
                    {
                        $inc: { quoteCount: 1 },
                        $addToSet: { quotedBy: userId }
                    },
                    { new: true }
                )
                .exec();

            this.publicFeedsGateway.emitQouteCountOnPost({
                postId: createPostInput.originalPost.toString(),
                qouteCount: originalPostt.quoteCount
            });

            /* Notification */
            if (userId.toString() !== repliedOnPost?.author?.toString()) {
                this.notificationService.create({
                    type: NotificationType.COMMENT,
                    sender: ENotificationFromType.USER,
                    from: userId,
                    receiver: originalPostt.author,
                    post: originalPostt?._id
                });
            }

            //Add mintstargram score for repost with thoughts
            if (post) {
                await this.scoresService.createScore(
                    userId,
                    'repostWithThought'
                );
            }

            return post;
        }

        if (mentions.length > 0) {
            mentions.forEach((element) => {
                if (userId.toString() !== element.id.toString()) {
                    this.notificationService.create({
                        type: NotificationType.MENTIONED,
                        sender: ENotificationFromType.USER,
                        from: userId,
                        receiver: new Types.ObjectId(element.id),
                        post: post?._id
                    });
                }
            });
        }

        //Add mintstargram score for creating post
        if (post) {
            if (
                !post.originalPost &&
                !post.inReplyToPost &&
                !post.tokenData &&
                mentions.length == 0
            ) {
                this.notificationService.alertFollowers4Post(
                    userId,
                    owner.userName,
                    post._id,
                    post.text
                );
                await this.scoresService.createScore(userId, 'post');
            }
            if (post.tokenData) {
                this.notificationService.alertFollowers4Mintpost(
                    userId,
                    owner.userName,
                    post.tokenData.tokenId,
                    post.tokenData.name,
                    post._id,
                    post.tokenData.image
                );
                this.scoresService.createScore(userId, 'mint');
            }
        }
        return post;
    }

    async isDuplicateContent(
        userId: Types.ObjectId,
        text: string,
        inReplyToPost: string
    ): Promise<boolean> {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        const query: QueryOfDuplicateC = {
            author: userId,
            text,
            createdAt: { $gte: twentyFourHoursAgo }
        };

        if (inReplyToPost) {
            query.inReplyToPost = new Types.ObjectId(inReplyToPost);

            const existingPostComment = await this.postModel
                .findOne(query)
                .exec();

            return !!existingPostComment;
        } else {
            const existingPost = await this.postModel.findOne(query).exec();

            if (existingPost && !existingPost.inReplyToPost) {
                return true;
            }

            return false;
        }
    }
    // async isDuplicateContent(
    //     userId: Types.ObjectId,
    //     text: string,
    //     inReplyToPost:string
    // ): Promise<boolean> {
    //     const twentyFourHoursAgo = new Date();
    //     twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    //     const existingPost = await this.postModel
    //         .findOne({
    //             author: userId,
    //             text,
    //             createdAt: { $gte: twentyFourHoursAgo }
    //         })
    //         .exec();

    //     console.log(existingPost, 'posttttttt');
    //     if ( existingPost && !existingPost?.inReplyToPost) {
    //         return true;
    //     }
    //     if(existingPost?.inReplyToPost){

    //         const existingPostComment = await this.postModel
    //         .findOne({
    //             author: userId,
    //             text,
    //             inReplyToPost,
    //             createdAt: { $gte: twentyFourHoursAgo }
    //         })
    //         .exec();
    //         console.log(existingPostComment,"existingPostComment");
    //         console.log({
    //             author: userId,
    //             text,
    //             inReplyToPost,
    //             createdAt: { $gte: twentyFourHoursAgo }
    //         },'ddd');

    //         return false

    //     }

    //     // return !!existingPost;
    // }

    async repost(createPostInput: CreateRePostInput, userId: Types.ObjectId) {
        const originalPost = await this.postModel
            .findById(createPostInput.originalPost)
            .exec();

        if (!originalPost) {
            throw new Error('The post you are reposting does not exist.');
        }

        const { hashtags, mentions } = extractMentionsAndHashtags(
            createPostInput.text
        );
        let hashtagss: HashtagDocument[] = [];
        if (hashtags?.length > 0) {
            const tags = await this.hashtagsService.findOrCreateMany(
                hashtags.map((item) => item.tag)
            );
            hashtagss = tags;
        }

        const post = await this.postModel.create({
            ...createPostInput,
            originalPost: new Types.ObjectId(createPostInput.originalPost),
            author: userId,
            ...(mentions.length > 0 && {
                mentions: mentions.map((item) => item.id)
            }),
            ...(hashtagss.length > 0 && {
                hashtags: hashtagss.map((item) => item?._id)
            })
        });

        // Increment repostCount and add the userId to postedBy array
        const originalPostt = await this.postModel
            .findByIdAndUpdate(originalPost._id, {
                $inc: { quoteCount: 1 },
                $addToSet: { quotedBy: userId }
            })
            .exec();

        this.publicFeedsGateway.emitRepostCountOnPost({
            postId: createPostInput.originalPost.toString(),
            repostCount: originalPostt.repostCount
        });

        await this.feedsService.createFeed({
            post: post?._id,
            type: FeedTypes.REPOST,
            owner: userId
        });

        /* Notification */
        this.notificationService.create({
            type: NotificationType.REPOST,
            sender: ENotificationFromType.USER,
            from: userId,
            receiver: post.author,
            post: post?._id
        });

        /* Mention Notification */
        if (mentions.length > 0) {
            mentions.forEach((element) => {
                this.notificationService.create({
                    type: NotificationType.MENTIONED,
                    sender: ENotificationFromType.USER,
                    from: userId,
                    receiver: new Types.ObjectId(element.id),
                    post: post?._id
                });
            });
        }
        return post;
    }

    async findAll(
        query: FilterQuery<PostFilterInput>,
        limit: number,
        cursor?: string
    ): Promise<{
        records: PostDocument[];
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        totalPostsCount: number;
    }> {
        try {
            const bannedUsers = await this.userService.allBannedUsers();

            let hashtag: HashtagDocument;
            if (query?.hashtag) {
                hashtag = await this.hashtagsService.hashtagModel
                    .findOne({ name: query?.hashtag })
                    .exec();
            }

            let updatedQuery = query;

            updatedQuery = {
                author: { $nin: bannedUsers },
                ...(cursor && {
                    _id: {
                        $gt: cursor
                    }
                }),
                ...(hashtag && {
                    hashtags: {
                        $in: hashtag?._id
                    }
                }),
                ...(query?.scheduled && {
                    $or: [
                        { scheduledAt: { $exists: false } },
                        { scheduledAt: { $lte: new Date() } }
                    ]
                })
            };

            const posts = await this.postModel
                .find(updatedQuery)
                .limit(limit + 1)
                .sort({ _id: -1 });

            const hasNextPage = posts.length > limit;
            const totalPostsCount = await this.postModel.count(updatedQuery);
            const edges = hasNextPage ? posts.slice(0, -1) : posts;
            const endCursor = hasNextPage
                ? edges[edges.length - 1]._id.toString()
                : null;

            return {
                records: edges,
                pageInfo: {
                    hasNextPage,
                    endCursor
                },
                totalPostsCount
            };
        } catch (error) {
            console.log(error);
        }
    }

    async addPostView(
        postId: Types.ObjectId,
        userId: Types.ObjectId
    ): Promise<Post> {
        return this.postModel.findByIdAndUpdate(
            postId,
            {
                $addToSet: { viewedBy: userId },
                $inc: { postViews: 1 }
            },
            { new: true }
        );
    }

    async remove(
        postId: Types.ObjectId,
        userId: Types.ObjectId,
        isAdmin?: boolean
    ) {
        const post = await this.postModel.findById(postId).exec();
        if (!post) {
            throw new Error('This post is not exists.');
        }
        if (!isAdmin) {
            if (post.author.toString() !== userId.toString()) {
                throw new Error('You are not the owner of this post.');
            }
        }

        const deletedPost = await this.postModel.findByIdAndDelete(postId);
        this.publicFeedsGateway.emitDeletePost(deletedPost);

        /* Remove mintstargram score for removing post */
        if (post) {
            await this.scoresService.createScore(userId, 'removePost');
        }

        if (post?.inReplyToPost) {
            const inReplyToPost = await this.postModel.findById(
                post?.inReplyToPost
            );

            let commentsBy = [...inReplyToPost.commentsBy];
            const commentCount = Number(inReplyToPost?.commentsCount || 0) - 1;

            const { records: comments } = await this.findReplies(
                inReplyToPost._id,
                { limit: 10, cursor: null }
            );

            if (
                comments.length > 0 &&
                comments.filter((c) => c.author._id.equals(userId)).length === 1
            ) {
                commentsBy = commentsBy.filter(
                    ({ _id }) => _id.toString() !== userId.toString()
                );
            } else {
                commentsBy = [];
            }

            this.publicFeedsGateway.emitCommentCountOnPost({
                postId: post.inReplyToPost.toString(),
                commentCounts: commentCount,
                commentsBy: commentsBy
            });

            await this.postModel.findByIdAndUpdate(inReplyToPost._id, {
                commentsCount: commentCount,
                commentsBy
            });
        }

        // We need to delete all comments and related feeds if we're deleting a comment👍
        const replies = await this.postModel
            .find({ inReplyToPost: postId })
            .exec();

        const replyIds = replies.map((r) => r._id);
        replyIds.push(postId);

        if (isAdmin) {
            if (userId.toString() !== post?.author?.toString()) {
                this.notificationService.create({
                    type: NotificationType.SYSTEM,
                    sender: ENotificationFromType.APP,
                    message: `We have removed your post due to malicious activity`,
                    receiver: post.author
                });
            }
        }

        await this.feedsService.feedModel
            .deleteMany({ post: { $in: replyIds } })
            .exec();

        return deletedPost;
    }

    async findOneAndDelete(query: FilterQuery<FeedDocument>) {
        return this.postModel.findOneAndDelete(query);
    }

    async vote(
        id: Types.ObjectId,
        optionIndex: number,
        userId: Types.ObjectId
    ): Promise<PostDocument> {
        const post = await this.postModel.findById(id).exec();

        if (!post) {
            throw new Error('This post does not exist.');
        }

        // Check if the poll is expired
        if (post?.poll?.expiresAt && new Date() > post?.poll?.expiresAt) {
            throw new Error('This poll has expired');
        }
        if (post?.poll?.options[optionIndex]) {
            const previousVoteIndex = post.poll.options.findIndex((option) =>
                option.voters.includes(userId)
            );

            if (previousVoteIndex > -1) {
                if (previousVoteIndex === optionIndex) {
                    throw new Error('User has already voted for this option');
                } else {
                    // Remove the previous vote
                    post.poll.options[previousVoteIndex].votes--;
                    post.poll.options[previousVoteIndex].voters =
                        post.poll.options[previousVoteIndex].voters.filter(
                            (voter) => !voter.equals(userId)
                        );
                }
            }

            // Add the new vote
            post.poll.options[optionIndex].votes++;
            post.poll.options[optionIndex].voters.push(userId);

            if (userId.toString() !== post.author.toString()) {
                /* Notification */
                this.notificationService.create({
                    type: NotificationType.VOTE,
                    sender: ENotificationFromType.USER,
                    from: userId,
                    receiver: post.author,
                    post: id
                });
            }
            return post.save();
        } else {
            throw new Error('Invalid option index');
        }
    }

    async withholdVote(
        id: string,
        optionIndex: number,
        userId: Types.ObjectId
    ): Promise<PostDocument> {
        const post = await this.postModel.findById(id).exec();

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        // Check if the poll is expired
        if (post.poll.expiresAt && new Date() > post.poll.expiresAt) {
            throw new Error('This poll has expired');
        }
        if (post.poll.options[optionIndex]) {
            const voterIndex =
                post.poll.options[optionIndex].voters.indexOf(userId);
            if (voterIndex > -1) {
                post.poll.options[optionIndex].votes--;
                post.poll.options[optionIndex].voters.splice(voterIndex, 1);
                return post.save();
            } else {
                throw new Error('User has not voted for this option');
            }
        } else {
            throw new Error('Invalid option index');
        }
    }

    async checkIfUserVoted(
        id: string,
        userId: Types.ObjectId
    ): Promise<PollOptionDocument> {
        const post = await this.postModel.findById(id).exec();
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        if (
            post.poll.options.some((option) => option.voters.includes(userId))
        ) {
            const option = post.poll.options.find((option) =>
                option.voters.includes(userId)
            );

            return option;
        } else {
            return null;
        }
    }

    async instantRepost(
        postId: string,
        owner: UserDocument,
        collection_Id: string,
        nftTokenData?: UpdateNftForPost,
        landId?: string,
        stakingId?: string,
        collection?: CollectionInput,
        token?: TokenInput,
        stage?: StageInput
    ): Promise<Post> {
        const { _id: userId } = owner;

        let originalPost = null;

        if (!postId && collection_Id) {
            //  Create a post for <collectionId>
            const collection = await this.collectionServivce.findById(
                new Types.ObjectId(collection_Id)
            );
            if (!collection.post) {
                const post = await new this.postModel({
                    _collection: new Types.ObjectId(collection_Id)
                });
                originalPost = post;
                post.save();
                await collection.updateOne({ post: post._id });
            }
        } else if (nftTokenData) {
            const { chain, contract, tokenId, collectionId } = nftTokenData;
            if (postId) {
                const post = await this.postModel.findOne({
                    _id: new Types.ObjectId(postId)
                });
                if (!post.collectionOfToken) {
                    let collection;
                    if (!nftTokenData.collectionId) {
                        collection =
                            await this.collectionServivce.findByAddressAndChain(
                                contract,
                                chain
                            );
                    }
                    const collectionID = collectionId || collection._id;
                    await post.updateOne({ collectionOfToken: collectionID });
                    originalPost = post;
                }
            } else {
                // Create a post for <nftTokenData>
                const nftToken = await this.tokenModel.findOne({
                    tokenId: tokenId,
                    chain: chain,
                    contract: contract
                });
                if (nftToken.post) {
                    originalPost = await this.postModel
                        .findById(nftToken.post)
                        .exec();
                } else {
                    let collection;
                    if (!nftTokenData.collectionId) {
                        collection =
                            await this.collectionServivce.findByAddressAndChain(
                                contract,
                                chain
                            );
                    }
                    const collectionID =
                        nftTokenData.collectionId || collection._id;
                    if (nftToken && !nftToken.post) {
                        const post = await new this.postModel({
                            token: {
                                tokenId: nftToken.tokenId,
                                contract: nftToken.contract,
                                chain: nftToken.chain,
                                image: nftToken.image,
                                _id: new Types.ObjectId(nftToken._id),
                                name: nftToken.name,
                                owner: nftToken.owner
                            },
                            collectionOfToken: new Types.ObjectId(collectionID)
                        });
                        originalPost = post;
                        await post.save();
                        await nftToken.updateOne({ post: post._id });
                    }
                }
            }
        } else if (landId) {
            // MR_lands
            if (postId) {
                originalPost = await this.postModel
                    .findById(new Types.ObjectId(postId))
                    .exec();
            }
        } else if (!postId && stakingId) {
            const stakingCollection = await this.stakingCollectionModel.findOne(
                { _id: new Types.ObjectId(stakingId) }
            );
            const post = await new this.postModel({
                staking: stakingCollection._id,
                author: new Types.ObjectId('64f7002d7f4a784cb15119bb') // userId of username = Ruffyworld
            });
            await stakingCollection.updateOne({
                post: post._id
            });
            originalPost = post;
            await post.save();
        } else if (collection) {
            const { name, chain, contract, image, banner } = collection;
            const post = await this.postModel.findOne({
                'collectionData.chain': collection.chain,
                'collectionData.contract': collection.contract
            });
            if (post) {
                await post.updateOne({
                    collectionData: {
                        name: name,
                        chain: chain,
                        contract: contract?.toLowerCase(),
                        image,
                        banner
                    }
                });

                originalPost = post;
            } else {
                const post = await new this.postModel({
                    collectionData: {
                        name: name,
                        chain: chain,
                        contract: contract?.toLowerCase(),
                        image,
                        banner
                    }
                });
                post.save();
                originalPost = post;
            }
        } else if (token) {
            const {
                name,
                chain,
                contract,
                image,
                tokenId,
                collectionName,
                collectionImage
            } = token;

            const post = await this.postModel.findOne({
                'tokenData.chain': {
                    $regex: new RegExp(token.chain.toLocaleLowerCase(), 'i')
                },
                'tokenData.contract': {
                    $regex: new RegExp(token.contract, 'i')
                },
                'tokenData.tokenId': token.tokenId
            });
            if (post) {
                await post.updateOne({
                    tokenData: {
                        name,
                        chain,
                        contract,
                        tokenId,
                        image,
                        collectionName,
                        collectionImage
                    }
                });
                originalPost = post;
            } else {
                const post = await new this.postModel({
                    tokenData: {
                        name,
                        chain,
                        contract: contract?.toLowerCase(),
                        tokenId,
                        image,
                        collectionName,
                        collectionImage
                    }
                });
                post.save();

                originalPost = post;
            }
        } else if (stage) {
            const { id, title, description } = stage;
            const post = await this.postModel.findOne({
                'stage.id': stage.id
            });
            if (post) {
                originalPost = post;
            } else {
                const post = await new this.postModel({
                    author: new Types.ObjectId(stage.author),
                    stage: {
                        id,
                        title,
                        description
                    }
                });
                post.save();
                originalPost = post;
            }
        } else {
            originalPost = await this.postModel
                .findById(new Types.ObjectId(postId))
                .exec();
        }
        if (!originalPost) {
            throw new Error('The post you are reposting does not exist.');
        }
        const requiredIndex = originalPost?.repostedAtByUsers?.findIndex(
            (item) => String(item.user) === String(userId)
        );

        if (requiredIndex !== -1) {
            // Checking if 24 hours completed or not.
            const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
            const timestamp = new Date().getTime();
            const postRepostedTime = new Date(
                originalPost?.repostedAtByUsers[requiredIndex]?.repostedAt
            ).getTime();
            const timeDifference = timestamp - postRepostedTime;
            if (timeDifference >= ONE_DAY_IN_MS === false)
                throw new Error('You can only repost once in 24 hours.');
        }
        const newArray = originalPost?.repostedAtByUsers;
        if (requiredIndex !== -1) {
            newArray[requiredIndex] = {
                ...newArray[requiredIndex],
                repostedAt: new Date(),
                user: new Types.ObjectId(userId)
            };
        }

        // Increment repostCount and add the userId to postedBy array
        const update =
            requiredIndex === -1
                ? {
                      // if not the same user
                      $inc: { repostCount: 1 },
                      $push: { repostedBy: userId },
                      $addToSet: {
                          repostedAtByUsers: {
                              user: new Types.ObjectId(userId),
                              repostedAt: new Date()
                          }
                      }
                  }
                : {
                      // if same user then update only userId
                      $inc: { repostCount: 1 },
                      $push: { repostedBy: userId },
                      repostedAtByUsers: newArray
                  };

        const originalPostt = await this.postModel
            .findByIdAndUpdate(originalPost._id, update, { new: true })
            .exec();

        this.publicFeedsGateway.emitRepostCountOnPost({
            postId: originalPost.id.toString(),
            repostCount: originalPostt?.repostCount
        });

        // const ot = await this.feedsService.createFeed({
        //     post: originalPost?._id,
        //     type: FeedTypes.REPOST,
        //     owner: userId,
        //     ...(collection_Id &&
        //         !postId && { _collection: new Types.ObjectId(collection_Id) })
        // });
        // console.log(ot);

        /* Notification */
        const receiver = await this.userModel.findById(originalPost.author);

        if (
            postId &&
            originalPost.author &&
            userId.toString() !== originalPost.author.toString()
        ) {
            this.notificationService.create({
                type: NotificationType.REPOST,
                sender: ENotificationFromType.USER,
                from: userId,
                receiver: originalPost.author,
                post: originalPost?._id
            });

            if (!originalPostt.originalPost && !originalPostt.inReplyToPost) {
                // console.log('for simple repost of a post')
                receiver?.email &&
                    this.emailService.sendRepostEmail(
                        receiver.email,
                        `${owner.userName}`,
                        originalPost.text,
                        `${process.env.FRONT_BASE_URL}/feeds/${originalPost._id}`
                    );
            } else if (
                !originalPostt.originalPost &&
                originalPostt.inReplyToPost
            ) {
                receiver?.email &&
                    this.emailService.sendRepostCommentEmail(
                        receiver.email,
                        `${owner.userName}`,
                        originalPost.text,
                        `${process.env.FRONT_BASE_URL}/feeds/${originalPost._id}`
                    );
            } else if (
                originalPostt.originalPost &&
                originalPostt.inReplyToPost
            ) {
                // console.log("for comment's reply");
                receiver?.email &&
                    this.emailService.sendRepostCommentEmail(
                        receiver.email,
                        `${owner.userName}`,
                        originalPost.text,
                        `${process.env.FRONT_BASE_URL}/feeds/${originalPost._id}`
                    );
            }
        }

        //Add mintstargram score for repost
        if (originalPost) {
            await this.scoresService.createScore(userId, 'repost');
            receiver?.email &&
                this.notificationService.alertFollowers4Repost(
                    userId,
                    owner.userName,
                    originalPost._id,
                    originalPost.text,
                    [receiver.email],
                    [receiver._id]
                );
        }

        return originalPost;
    }

    async toggleFollowCollection(
        userId: Types.ObjectId,
        postId: string
    ): Promise<PostDocument> {
        if (!postId) throw new BadRequestException('Id is missing');
        try {
            const post = await this.postModel.findById(postId).exec();

            const user = await this.userModel
                .findById(userId)
                .select('-followingTimestamps -followersTimestamps');
            //delete user.followingTimestamps;
            //delete user.followersTimestamps;

            const index = post.collectionFollowers.findIndex(
                (id) => id.toString() === userId.toString()
            );
            if (index === -1) {
                user.followingCollections.push(new Types.ObjectId(postId));
                post.collectionFollowers.push(userId);
                post.collectionFollowersCount++;
            } else {
                const i = user.followingCollections.findIndex(
                    (id) => id.toString() === userId.toString()
                );
                user.followingCollections.splice(i, 1);
                post.collectionFollowers.splice(index, 1);
                post.collectionFollowersCount--;
            }

            await user.save();

            if (post.collectionData?.contract) {
                const following = await this.collectionServivce.findOne({
                    contract: {
                        $regex: new RegExp(
                            `^${post.collectionData.contract}$`,
                            'i'
                        )
                    },
                    chain: post.collectionData.chain
                });
                const isFollower =
                    following?.followers?.filter(
                        (el) => el?.toString() == userId?.toString()
                    ).length > 0;

                const newFollowersCount = isFollower
                    ? Number(following?.followers?.length || 0) - 1
                    : Number(following?.followers?.length || 0) + 1;

                const arr = await this.collectionServivce.updateOne(
                    {
                        contract: {
                            $regex: new RegExp(
                                `^${post.collectionData.contract}$`,
                                'i'
                            )
                        },
                        chain: post.collectionData.chain
                    },
                    {
                        [isFollower ? '$pull' : '$addToSet']: {
                            followers: userId
                        },
                        followersCount: newFollowersCount
                    }
                );

                console.log(isFollower, 'post.collectionData', arr);
            }

            return this.postModel
                .findOneAndUpdate(
                    { _id: postId },
                    {
                        collectionFollowers: post.collectionFollowers,
                        collectionFollowersCount: post.collectionFollowersCount
                    },
                    { new: true }
                )
                .exec();
        } catch (error) {
            console.log('error', error);
        }
    }

    async getFollowedContracts(
        userId: Types.ObjectId,
        chain: string
    ): Promise<ContractsData[]> {
        try {
            const user = await this.userModel.findById(userId);
            const { followingCollections } = user;
            const posts = await this.postModel.find({
                _id: { $in: followingCollections }
            });
            const contractsData = posts
                .map((item) => {
                    return {
                        chain: item.collectionData.chain,
                        contract: item.collectionData.contract
                    };
                })
                .filter((item) => item.chain === chain);
            return contractsData;
        } catch (error) {
            console.log('error', error);
        }
    }

    async getSchedulePosts(userId: Types.ObjectId): Promise<PostDocument[]> {
        const query = {
            author: userId,
            scheduledAt: {
                $gt: new Date()
            }
        };

        return await this.postModel.find(query).sort({ _id: -1 });
    }

    async postTweet(
        status: string,
        imagePaths: string[],
        accessToken: string,
        accessSecret: string
    ): Promise<void> {
        let client = new TwitterApi({
            appKey: process.env.TWITTER_CONSUMER_KEY,
            appSecret: process.env.TWITTER_CONSUMER_SECRET,
            // appKey: 'RdKeJZgn21yOyP5aKt8piFvWg',
            // appSecret: 'IZhfVaIT9PfeRMXo8Nv8L4ZociO3g0UuFimYn4MaoZlv19ZT2F',
            accessToken,
            accessSecret
        });

        try {

            const expired = await this.validateTwitterAccessToken(
                accessToken,
                accessSecret
            );

            if(expired) { // If access token is expired.
                const { client: refreshedClient, accessToken: newAccessToken, refreshToken: newRefreshToken } = await client.refreshOAuth2Token(accessSecret);
                
                /* Update user collection */
                await this.userService.findOneAndUpdate({twitterAccessToken: accessToken} , {
                    twitterAccessToken: newAccessToken,
                    twitterAccessSecret: newRefreshToken
                });
                
                client = refreshedClient;
                accessToken = newAccessToken;
                accessSecret = newRefreshToken;
                
            }

            const mediaIds: string[] = [];

            // Upload each image using the uploadMedia() method
            if (imagePaths) {
                for (const imagePath of imagePaths) {
                    const fileName = path.basename(imagePath);
                    const filePath = path.join(__dirname, fileName);
                    const file = fs.createWriteStream(filePath);
                    https.get(imagePath, (response) => {
                        response.pipe(file);
                    });

                    await new Promise<void>((resolve, reject) => {
                        file.on('finish', async () => {
                            try {
                                const mediaResponse =
                                    await client.v1.uploadMedia(filePath);
                                mediaIds.push(mediaResponse);
                                resolve();
                            } catch (error) {
                                reject(error);
                            }
                        });

                        file.on('error', (error) => {
                            reject(error);
                        });
                    });
                }
            }
            const content = convertMarkupToString(status);
            // Post the tweet with the uploaded media using the tweet() method
            await client.v1.tweet(content, {
                media_ids: mediaIds.join(',')
            });

            console.log('Tweet posted successfully!');
        } catch (error) {
            console.error('Error posting tweet:', error);
            throw new Error('Failed to share airdrop on Twitter.');
        }
    }

    async validateTwitterAccessToken(
        accessToken: string,
        accessSecret: string
    ): Promise<boolean> {
        try {
            const client = new TwitterApi({
                appKey: process.env.TWITTER_CONSUMER_KEY,
                appSecret: process.env.TWITTER_CONSUMER_SECRET,
                // appKey: 'RdKeJZgn21yOyP5aKt8piFvWg',
                // appSecret: 'IZhfVaIT9PfeRMXo8Nv8L4ZociO3g0UuFimYn4MaoZlv19ZT2F',
                accessToken,
                accessSecret
            });
            // Use the client to make a simple API request to check if the token is valid
            const user = await client.v1.verifyCredentials();
            return !!user; // If the request succeeds, the token is still valid
        } catch (error) {
            return false; // If there's an error, the token has likely expired
        }
    }

    async updateTimeSpentOnPost(
        postId: Types.ObjectId,
        time: number
    ): Promise<Post> {
        try {
            // Find the post by postId
            const post = await this.postModel.findById(postId).exec();

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            // Calculate the timestamp to add
            const timestampToAdd = new Date();

            let collectionViewsTimestamps = post.collectionViewsTimestamps;
            // Push the new timestamp into the collectionViewsTimestamps array
            collectionViewsTimestamps.push(timestampToAdd);

            // Remove timestamps older than 24 hours
            const twentyFourHoursAgo = new Date(
                Date.now() - 24 * 60 * 60 * 1000
            );
            collectionViewsTimestamps = collectionViewsTimestamps.filter(
                (timestamp) => timestamp >= twentyFourHoursAgo
            );

            // Update the postViews and collectionViewsTimestamps
            let postViews = post.postViews;
            postViews += Math.floor(time);

            this.publicFeedsGateway.emitPostViews({
                postId: postId.toString(),
                postViews: postViews
            });

            return await this.postModel.findOneAndUpdate(
                { _id: postId },
                {
                    $set: {
                        postViews: postViews,
                        collectionViewsTimestamps: collectionViewsTimestamps
                    }
                },
                { new: true }
            );

            //return await post.save();
        } catch (error) {
            console.error(error);
        }
    }
}
