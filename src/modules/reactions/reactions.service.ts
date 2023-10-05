// services/reaction.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Reaction, ReactionDocument } from './entities/reaction.entity';
import { Post, PostDocument } from '../feeds/entities/post.entity';
import { FeedTypes } from '../feeds/feeds.enums';
import { Feed, FeedDocument } from '../feeds/entities/feed.entity';
import { PublicFeedsGateway } from '../gateways/public/public-feeds.gateway';
import { ReactionType } from './reactions.enums';
import { NotificationService } from '../notifications/notification.service';
import {
    ENotificationFromType,
    NotificationType
} from '../notifications/notifications.enum';
import { Message, MessageDocument } from '../chat/entities/message.entity';
import { User } from '../users/entities/user.entity';
import { ScoresService } from '../scores/scores.service';
import { CollectionDocument } from '../collections/entities/collection.entity';
import { COLLECTIONS } from 'src/constants/db.collections';
import { Nft, NftDocument } from '../nfts/entities/nft.entity';
import {
    CollectionInput,
    TokenInput,
    UpdateNftForPost
} from '../feeds/dto/update-feed.input';
import {
    StakingCollection,
    StakingCollectionDocument
} from '../staking/entities/collection.staking.entity';
import { EmailService } from '../shared/services/email.service';

@Injectable()
export class ReactionService {
    constructor(
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        @InjectModel(Feed.name) private feedModel: Model<FeedDocument>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(StakingCollection.name)
        private stakingCollectionModel: Model<StakingCollectionDocument>,
        @InjectModel(COLLECTIONS)
        private collectionModel: Model<CollectionDocument>,
        @InjectModel(Nft.name)
        private tokenModel: Model<NftDocument>,
        @InjectModel(Reaction.name)
        public readonly reactionModel: Model<ReactionDocument>,
        private notificationService: NotificationService,
        private publicFeedsGatway: PublicFeedsGateway,
        private readonly scoresService: ScoresService, // private collectionServivce: CollectionsService,
        private readonly emailService: EmailService
    ) {}

    async getReactionsWithCursor(
        postId: Types.ObjectId,
        limit = 10,
        cursor?: string
    ): Promise<{ reactions: Reaction[]; endCursor: string }> {
        const query = {
            post: postId,
            ...(cursor ? { _id: { $lt: cursor } } : {})
        };

        const reactions = await this.reactionModel
            .find(query)
            .sort({ _id: -1 })
            .limit(limit + 1)
            .exec();

        const hasMore = reactions.length > limit;
        if (hasMore) {
            reactions.pop();
        }
        const endCursor = hasMore ? reactions[reactions.length - 1]._id : null;

        return { reactions, endCursor };
    }

    async addReactionToPost(
        receivedPostId: string | Types.ObjectId,
        userId: Types.ObjectId,
        emoji: ReactionType,
        collectionId?: string,
        nftTokenData?: UpdateNftForPost,
        stakingId?: string,
        collection?: CollectionInput,
        token?: TokenInput
    ): Promise<Reaction> {
        let post_ID = receivedPostId;
        if (!post_ID && collectionId) {
            // Create a post for collection
            const collection = await this.collectionModel
                .findById(collectionId)
                .exec();
            if (!collection.post) {
                const post = await new this.postModel({
                    _collection: collectionId
                });
                post_ID = post._id;
                post.save();
                await collection.updateOne({ post: post._id });
            }
        }
        if (!post_ID && nftTokenData) {
            // Create a post for nftToken
            const { chain, contract, tokenId } = nftTokenData;
            const nftToken = await this.tokenModel.findOne({
                tokenId: tokenId,
                chain: chain,
                contract: contract
            });

            if (nftToken && !nftToken.post) {
                const post = await new this.postModel({
                    token: {
                        tokenId: nftToken.tokenId,
                        contract: nftToken.contract,
                        chain: nftToken.chain,
                        image: nftToken.image,
                        _id: nftToken._id
                    },
                    collectionOfToken: new Types.ObjectId(
                        nftTokenData.collectionId
                    )
                });
                post_ID = post._id;
                post.save();
                await nftToken.updateOne({ post: post._id });
            }
        }
        if (!post_ID && stakingId) {
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
            post_ID = post._id;
            await post.save();
        }
        if (collection) {
            const post = await this.postModel.findOne({
                'collectionData.chain': collection.chain,
                'collectionData.contract': collection.contract
            });
            if (post) {
                post_ID = post._id;
            } else {
                const { name, chain, contract, image } = collection;
                const post = await new this.postModel({
                    collectionData: {
                        name: name,
                        chain: chain,
                        contract: contract,
                        image
                    }
                });
                post.save();
                post_ID = post._id;
            }
        }
        if (token) {
            console.log('in the required condition');
            const post = await this.postModel.findOne({
                'tokenData.chain': token.chain,
                'tokenData.contract': token.contract,
                'tokenData.tokenId': token.tokenId
            });
            if (post) {
                post_ID = post._id;
            } else {
                const {
                    name,
                    chain,
                    contract,
                    tokenId,
                    image,
                    collectionName,
                    collectionImage
                } = token;
                const post = await new this.postModel({
                    tokenData: {
                        name,
                        chain,
                        contract:contract?.toLowerCase(),
                        tokenId,
                        image,
                        collectionName,
                        collectionImage
                    }
                });
                post.save();
                post_ID = post._id;
            }
        }
        const postId = new Types.ObjectId(post_ID);
        const post = await (
            await this.postModel.findById(postId)
        ).populate('author');
        if (!post) {
            throw new Error('Post not found');
        }

        let reaction = await this.reactionModel
            .findOne({
                user: userId,
                post: postId,
                emoji: emoji
            })
            .exec();

        if (reaction) {
            throw new Error('User has already reacted to this item.');
        }

        reaction = new this.reactionModel({
            user: userId,
            emoji,
            post: postId
        });

        // Find the existing reaction in the post's reactions array
        const existingReactionIndex = post.reactions.findIndex(
            (r) => r.emoji === emoji
        );

        // If the reaction exists, increment the count
        if (existingReactionIndex !== -1) {
            post.reactions[existingReactionIndex].count++;
        } else {
            // If the reaction doesn't exist, add it to the reactions array
            post.reactions.push({
                emoji,
                count: 1
            });
        }

        await reaction.save();
        await this.postModel.updateOne(
            { _id: post._id },
            { reactions: post.reactions }
        );

        this.publicFeedsGatway.emitReactionsOnPost({
            postId: postId.toString(),
            reactions: post.reactions
        });

        this.feedModel.create({
            post: post?._id,
            type: FeedTypes.LIKE,
            owner: userId
        });

        if (userId.toString() !== post.author?._id?.toString()) {
            if (post.inReplyToPost) {
                this.notificationService.create({
                    type: NotificationType.Like_COMMENT,
                    sender: ENotificationFromType.USER,
                    from: userId,
                    receiver: post.author,
                    post: postId
                });
            } else {
                this.notificationService.create({
                    type: NotificationType.Like,
                    sender: ENotificationFromType.USER,
                    from: userId,
                    receiver: post.author,
                    post: postId
                });
            }
            /* Notification */

            const owner = await this.userModel.findById(userId);
            if (post.inReplyToPost) {
                this.emailService.sendLikeCommentEmail(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    post.author?.email,
                    `${owner.userName}`,
                    post.text,
                    `${process.env.FRONT_BASE_URL}/feeds/${post._id}`
                );
            } else {
                this.emailService.sendLikePostEmail(
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    post.author?.email,
                    `${owner.userName}`,
                    owner.avatar,
                    `${process.env.FRONT_BASE_URL}/feeds/${post._id}`
                );
            }
        }

        // Add mintstargram score for like
        if (reaction) {
            await this.scoresService.createScore(userId, 'like');
        }

        return reaction;
    }

    async removeReactionForPost(
        userId: Types.ObjectId,
        postId: Types.ObjectId
    ): Promise<ReactionDocument> {
        const post = await this.postModel.findById(postId).exec();
        if (!post) {
            throw new Error('Post not found.');
        }

        const reaction = await this.reactionModel
            .findOne({
                post: postId,
                user: userId
            })
            .exec();

        if (!reaction) {
            throw new Error('User has not reacted.');
        }

        await this.reactionModel.deleteOne({ _id: reaction._id }).exec();

        // Find the existing reaction in the post's reactions array
        const existingReactionIndex = post.reactions.findIndex(
            (r) => r.emoji === reaction.emoji
        );

        // If the reaction exists, decrement the count
        if (existingReactionIndex !== -1) {
            post.reactions[existingReactionIndex].count--;

            // If the count reaches 0, remove the reaction from the array
            if (post.reactions[existingReactionIndex].count === 0) {
                post.reactions.splice(existingReactionIndex, 1);
            }
        }
        await this.postModel.updateOne(
            { _id: post._id },
            { reactions: post.reactions }
        );
        this.publicFeedsGatway.emitReactionsOnPost({
            postId: postId.toString(),
            reactions: post.reactions
        });

        // Add mintstargram score for unlike
        if (reaction) {
            await this.scoresService.createScore(userId, 'unlike');
        }

        return reaction;
    }

    async toggleReactionForPost(
        postId: Types.ObjectId,
        userId: Types.ObjectId,
        emoji: ReactionType
    ): Promise<Reaction> {
        const post = await this.postModel.findById(postId).exec();
        if (!post) {
            throw new Error('Post not found');
        }

        const reaction = await this.reactionModel
            .findOne({
                user: userId,
                post: postId,
                emoji: emoji
            })
            .exec();

        if (reaction) {
            // If the user has already reacted, remove the reaction
            await this.removeReactionForPost(userId, postId);
            return null;
        } else {
            // If the user has not reacted, add the reaction
            return await this.addReactionToPost(postId, userId, emoji);
        }
    }

    /* Reactions for messages */
    async addReactionToMessage(
        messageId: Types.ObjectId,
        userId: Types.ObjectId,
        emoji: ReactionType
    ): Promise<Reaction> {
        const message = await this.messageModel.findById(messageId).exec();
        if (!message) {
            throw new Error('Message not found');
        }

        let reaction = await this.reactionModel
            .findOne({
                user: userId,
                message: messageId,
                emoji: emoji
            })
            .exec();

        if (reaction) {
            throw new Error('User has already reacted to this item.');
        }

        reaction = new this.reactionModel({
            user: userId,
            emoji,
            message: messageId
        });

        // Find the existing reaction in the post's reactions array
        const existingReactionIndex = message.reactions.findIndex(
            (r) => r.emoji === emoji
        );

        // If the reaction exists, increment the count
        if (existingReactionIndex !== -1) {
            message.reactions[existingReactionIndex].count++;
        } else {
            // If the reaction doesn't exist, add it to the reactions array
            message.reactions.push({
                emoji,
                count: 1
            });
        }

        await reaction.save();
        await message.save();

        // this.publicFeedsGatway.emitReactionsOnPost({
        //     messageId: messageId.toString(),
        //     reactions: message.reactions
        // });

        // if (userId.toString() !== message.author.toString()) {
        //     /* Notification */
        //     this.notificationService.create({
        //         type: NotificationType.Like,
        //         sender: ENotificationFromType.USER,
        //         from: userId,
        //         receiver: post.author,
        //         post: postId
        //     });
        // }

        return reaction;
    }

    async removeReactionForMessage(
        userId: Types.ObjectId,
        messageId: Types.ObjectId,
        emoji: string
    ): Promise<ReactionDocument> {
        const message = await this.messageModel.findById(messageId).exec();
        if (!message) {
            throw new Error('message not found.');
        }

        const reaction = await this.reactionModel
            .findOne({
                message: messageId,
                user: userId,
                emoji: emoji
            })
            .exec();

        if (!reaction) {
            throw new Error('User has not reacted.');
        }

        await this.reactionModel.deleteOne({ _id: reaction._id }).exec();

        // Find the existing reaction in the message's reactions array
        const existingReactionIndex = message.reactions.findIndex(
            (r) => r.emoji === reaction.emoji
        );

        // If the reaction exists, decrement the count
        if (existingReactionIndex !== -1) {
            message.reactions[existingReactionIndex].count--;

            // If the count reaches 0, remove the reaction from the array
            if (message.reactions[existingReactionIndex].count === 0) {
                message.reactions.splice(existingReactionIndex, 1);
            }
        }

        await message.save();
        // this.publicFeedsGatway.emitReactionsOnPost({
        //     postId: postId.toString(),
        //     reactions: post.reactions
        // });

        return reaction;
    }

    async toggleReactionForMessage(
        messageId: Types.ObjectId,
        userId: Types.ObjectId,
        emoji: ReactionType
    ): Promise<Reaction> {
        const message = await this.messageModel.findById(messageId).exec();
        if (!message) {
            throw new Error('message not found');
        }

        const reaction = await this.reactionModel
            .findOne({
                user: userId,
                message: messageId,
                emoji: emoji
            })
            .exec();

        if (reaction) {
            // If the user has already reacted, remove the reaction
            await this.removeReactionForMessage(userId, messageId, emoji);
            return null;
        } else {
            // If the user has not reacted, add the reaction
            return await this.addReactionToMessage(messageId, userId, emoji);
        }
    }

    async countReactionsForPost(postId: Types.ObjectId): Promise<number> {
        const count = await this.reactionModel
            .countDocuments({ post: postId })
            .exec();
        return count;
    }

    async getUsersByReactionType(
        postId: string,
        reactionType: ReactionType
    ): Promise<Types.ObjectId[]> {
        const query = {
            post: postId,
            emoji: reactionType
        };

        const reactions = await this.reactionModel
            .find(query)
            .populate('user')
            .exec();

        const users = reactions.map((reaction) => reaction.user);
        return users;
    }

    async getUserReaction(
        postId: Types.ObjectId,
        userId: Types.ObjectId,
        emoji?: string
    ): Promise<ReactionDocument> {
        const query = {
            post: postId,
            user: userId,
            ...(emoji && { emoji })
        };

        const reaction = await this.reactionModel.findOne(query).exec();

        return reaction;
    }

    async getTopReactions(
        postId: Types.ObjectId,
        limit = 3
    ): Promise<Array<{ emoji: ReactionType; count: number }>> {
        const query: PipelineStage[] = [
            {
                $match: {
                    post: postId
                }
            },
            {
                $group: {
                    _id: '$emoji',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: limit
            }
        ];

        const topReactions = await this.reactionModel.aggregate(query).exec();
        return topReactions.map((item) => ({
            emoji: item._id,
            count: item.count
        }));
    }

    async hasUserReactedToPost(
        userId: Types.ObjectId,
        postId: Types.ObjectId
    ): Promise<boolean> {
        const reaction = await this.reactionModel.findOne({
            user: userId,
            post: postId
        });
        return !!reaction;
    }

    async hasUserReactedToMessage(
        userId: Types.ObjectId,
        messageId: Types.ObjectId
    ): Promise<boolean> {
        const reaction = await this.reactionModel.findOne({
            user: userId,
            message: messageId
        });

        return !!reaction;
    }

    async userReactionsOnPost(
        userId: Types.ObjectId,
        postId: Types.ObjectId
    ): Promise<ReactionDocument[]> {
        const reaction = await this.reactionModel.find({
            user: userId,
            post: postId
        });
        return reaction;
    }

    async userReactiononsMessage(
        userId: Types.ObjectId,
        messageId: Types.ObjectId
    ): Promise<ReactionDocument[]> {
        const reaction = await this.reactionModel.find({
            user: userId,
            message: messageId
        });
        return reaction;
    }

    async getUserByPostReaction(
        emoji: string,
        postId: Types.ObjectId
    ): Promise<ReactionDocument> {
        const reaction = await this.reactionModel.findOne({
            emoji,
            post: postId
        });

        return reaction;
    }
}
