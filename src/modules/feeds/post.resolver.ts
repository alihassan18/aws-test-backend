import {
    Resolver,
    Query,
    Mutation,
    Args,
    Int,
    Context,
    ResolveField,
    Parent
} from '@nestjs/graphql';
import {
    CreateCollectionPostInput,
    CreatePostInput,
    CreateRePostInput,
    CreateTwitterPostInput,
    PaginatedResults,
    PostConnection,
    PostFilterInput
} from './dto/create-feed.input';
import {
    CollectionInput,
    StageInput,
    TokenInput,
    UpdateFeedInput,
    UpdateNftForPost
} from './dto/update-feed.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { FilterQuery, Types } from 'mongoose';
import { ContextProps } from 'src/interfaces/common.interface';
import { User, UserDocument } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
// import { GraphqlCacheInterceptor } from 'src/interceptors/graphql-cache.interceptor';
import { ContractsData, Post, PostDocument } from './entities/post.entity';
import { Hashtag, HashtagDocument } from './entities/hashtag.entity';
import { PostService } from './posts.service';
import { HashtagsService } from './hashtags.service';
import { PollOption, PollOptionDocument } from './entities/poll.entity';
import { LinkedinService } from '../social/linkedin.service';
import { VerifyEmailOutput } from '../users/dto/users.input';
import { ReferralVideoService } from '../referral-video/referral-video.service';
import {
    StakingCollection,
    StakingCollectionDocument
} from '../staking/entities/collection.staking.entity';
import { StakingCollectionService } from '../staking/staking.service';
import { Collection } from '../collections/entities/collection.entity';
import { CollectionsService } from '../collections/collections.service';
import { AdminGuard } from '../admin/admin.guard';
import { Role } from '../admin/role.decorator';

@Resolver(() => Post)
export class PostResolver {
    constructor(
        private readonly postService: PostService,
        private readonly userService: UsersService,
        private readonly hashtagsService: HashtagsService,
        private readonly linkedinService: LinkedinService,
        private readonly referralVideoService: ReferralVideoService,
        private readonly stakingCollectionService: StakingCollectionService,
        private readonly collectionService: CollectionsService
    ) {}

    @ResolveField(() => User)
    async voters(@Parent() post: Post): Promise<UserDocument[][]> {
        return Promise.all(
            post.poll.options.map(async (option) => {
                return Promise.all(
                    option.voters.map(async (userId) => {
                        return this.userService.findById(userId, true);
                    })
                );
            })
        );
    }

    @ResolveField(() => Post)
    async post(@Parent() post: Post): Promise<PostDocument> {
        return this.postService.findById(new Types.ObjectId(post?._id));
    }

    @ResolveField(() => Post)
    async inReplyToPost(@Parent() post: Post): Promise<PostDocument> {
        return this.postService.findById(
            new Types.ObjectId(post?.inReplyToPost)
        );
    }

    @ResolveField(() => User)
    async author(@Parent() post: Post): Promise<UserDocument> {
        return this.userService.findById(post.author, true);
    }

    @ResolveField(() => [Hashtag])
    async hashtags(@Parent() post: Post): Promise<HashtagDocument[]> {
        return this.hashtagsService.findHashtags({
            _id: { $in: post.hashtags }
        });
    }

    @ResolveField(() => StakingCollection)
    async staking(@Parent() post: Post): Promise<StakingCollectionDocument> {
        return this.stakingCollectionService.findOne(post.staking);
    }

    @ResolveField(() => Collection)
    async _collection(@Parent() post: Post): Promise<Collection> {
        return this.collectionService.findById(post._collection);
    }

    @ResolveField(() => Collection)
    async collectionOfToken(@Parent() post: Post): Promise<Collection> {
        return this.collectionService.findById(post.collectionOfToken);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Post)
    async createPost(
        @Args('createPostInput') createPostInput: CreatePostInput,
        @Args('createCollectionPostInput', { nullable: true })
        collectionData: CreateCollectionPostInput,

        @Context()
        context: ContextProps
    ) {
        const user = context.req.user;
        // console.log(user,'userid');

        let isDuplicate;
        if (!createPostInput?.inReplyToPost || createPostInput?.inReplyToPost) {
            isDuplicate = await this.postService.isDuplicateContent(
                user._id,
                createPostInput.text,
                createPostInput.inReplyToPost
            );
        }

        // const isDuplicate = true
        if (isDuplicate) {
            throw new Error('duplicate_post');
        } else {
            if (createPostInput.text?.length >= 300) {
                throw new Error('Text must be less than 300 characters');
            }
            const post = await this.postService.create(
                createPostInput,
                user,
                collectionData
            );

            if (createPostInput.twitter) {
                this.postService.postTweet(
                    createPostInput.text,
                    createPostInput.media,
                    user.twitterAccessToken,
                    user.twitterAccessSecret
                );
            }
            if (createPostInput.linkedin) {
                this.linkedinService.postOnLinkedIn(
                    user.linkedAccessToken,
                    createPostInput.text
                );
            }
            return post;
        }
    }

    @UseGuards(AuthGuard)
    @Query(() => Boolean)
    async validateTwitterAccessToken(
        @Context()
        context: ContextProps
    ) {
        const user = context.req.user;
        const expired = await this.postService.validateTwitterAccessToken(
            user.twitterAccessToken,
            user.twitterAccessSecret
        );

        return expired;
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Post)
    async createCustomPost(
        @Args('createPostInput') createPostInput: CreatePostInput,
        @Args('type') type: string,
        @Args('id') id: string, // id of a specific document of collection.
        @Context()
        context: ContextProps
    ) {
        const user = context.req.user;
        const post = await this.postService.createCustom(
            createPostInput,
            user?._id,
            type,
            id
        );
        return post;
    }

    @Query(() => PostConnection, { name: 'posts' })
    // @UseInterceptors(GraphqlCacheInterceptor)
    async posts(
        @Args('query', { type: () => PostFilterInput, nullable: true })
        query: FilterQuery<PostDocument>,
        @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
        @Args('cursor', { type: () => String, nullable: true }) cursor?: string
    ): Promise<PostConnection> {
        const { records, pageInfo, totalPostsCount } =
            await this.postService.findAll(query, limit, cursor);

        return {
            records,
            pageInfo,
            totalPostsCount
        };
    }

    @Query(() => Post, { name: 'post' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.postService.findById(new Types.ObjectId(id));
    }

    @Query(() => Post, { name: 'postOfCollection', nullable: true })
    findCollectionPost(
        @Args('contract', { type: () => String }) contract: string,
        @Args('chain', { type: () => String }) chain: string,
        @Args('name', { type: () => String, nullable: true }) name: string,
        @Args('image', { type: () => String, nullable: true }) image: string
    ) {
        return this.postService.findCollectionPost(
            contract,
            chain,
            name,
            image
        );
    }

    @Query(() => Post, { nullable: true })
    postOfNft(
        @Args('contract', { type: () => String }) contract: string,
        @Args('chain', { type: () => String }) chain: string,
        @Args('tokenId', { type: () => String }) tokenId: string
    ) {
        return this.postService.findNftPost(contract, chain, tokenId);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Post, { nullable: true, name: 'toggleFollowCollectionNew' })
    async toggleFollowCollection(
        @Args('postId') postId: string,
        @Context() ctx: ContextProps
    ) {
        const { _id: userId } = ctx.req.user;
        return this.postService.toggleFollowCollection(userId, postId);
    }

    @UseGuards(AuthGuard)
    @Query(() => [ContractsData], { nullable: true })
    async getFollowedContracts(
        @Args('chain') chain: string,
        @Context() ctx: ContextProps
    ) {
        const { _id: userId } = ctx.req.user;
        return this.postService.getFollowedContracts(userId, chain);
    }

    @Query(() => PaginatedResults, { name: 'replies' })
    replies(
        @Args('id', { type: () => String }) id: string,
        @Args('limit', { type: () => Number, defaultValue: 10 }) limit?: number,
        @Args('cursor', { type: () => String, nullable: true }) cursor?: string,
        @Args('loggedUserId', { type: () => String, nullable: true })
        loggedUserId?: string
    ): Promise<PaginatedResults> {
        return this.postService.findReplies(
            new Types.ObjectId(id),
            {
                limit,
                cursor
            },
            loggedUserId
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Post)
    updateFeed(
        @Args('updateFeedInput') updateFeedInput: UpdateFeedInput,
        @Context()
        context: ContextProps
    ) {
        const { _id: userId } = context.req.user;
        return this.postService.update(
            updateFeedInput.id,
            userId,
            updateFeedInput
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Post)
    removePost(
        @Args('postId', { type: () => String }) postId: string,
        @Context() context: ContextProps
    ) {
        const { _id: userId } = context.req.user;
        return this.postService.remove(new Types.ObjectId(postId), userId);
    }

    @UseGuards(AdminGuard)
    @Mutation(() => Post)
    @Role('admin')
    removePostByAdmin(
        @Args('postId', { type: () => String }) postId: string,
        @Context() context: ContextProps
    ) {
        const { _id: userId } = context.req.user;
        return this.postService.remove(
            new Types.ObjectId(postId),
            userId,
            true
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Post)
    async repostWithThouths(
        @Args('repostInput') repostInput: CreateRePostInput,
        @Context() context: ContextProps
    ): Promise<PostDocument> {
        const { _id: userId } = context.req.user;
        return this.postService.repost(repostInput, userId);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Post)
    async instantRepost(
        @Args('postId', { nullable: true }) postId: string,
        @Args('collectionId', { nullable: true }) collectionId: string,
        @Args('nftTokenData', { nullable: true })
        nftTokenData: UpdateNftForPost,
        @Args('landId', { nullable: true })
        landId: string,
        @Args('stakingCollectionId', { nullable: true })
        stakingId: string,
        @Args('collection', { nullable: true }) collection: CollectionInput,
        @Args('token', { nullable: true }) token: TokenInput,
        @Args('stage', { nullable: true }) stage: StageInput,
        @Context() context: ContextProps
    ): Promise<PostDocument> {
        const user = context.req.user;
        return this.postService.instantRepost(
            postId,
            user,
            collectionId,
            nftTokenData,
            landId,
            stakingId,
            collection,
            token,
            stage
        );
    }

    @ResolveField(() => Int)
    async originalPost(@Parent() post: Post): Promise<PostDocument> {
        return this.postService.findById(new Types.ObjectId(post.originalPost));
    }

    @ResolveField(() => Int)
    async repostedBy(@Parent() post: Post): Promise<UserDocument[]> {
        return this.userService.findAll(
            { _id: { $in: post.repostedBy } },
            true
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Post)
    async vote(
        @Args('postId') postId: string,
        @Args('optionIndex') optionIndex: number,
        @Context() context: ContextProps
    ): Promise<PostDocument> {
        const { _id: userId } = context.req.user;
        return this.postService.vote(
            new Types.ObjectId(postId),
            optionIndex,
            userId
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Post)
    async withholdVote(
        @Args('postId') postId: string,
        @Args('optionIndex') optionIndex: number,
        @Context() context: ContextProps
    ): Promise<PostDocument> {
        const { _id: userId } = context.req.user;
        return this.postService.withholdVote(postId, optionIndex, userId);
    }

    @UseGuards(AuthGuard)
    @Query(() => PollOption, { nullable: true })
    async checkIfUserVoted(
        @Args('postId', { type: () => String }) postId: string,
        @Context() context: ContextProps
    ): Promise<PollOptionDocument> {
        const currentUserId = context.req.user._id;
        return this.postService.checkIfUserVoted(postId, currentUserId);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Post)
    async addPostView(
        @Args('postId') postId: string,
        @Context() context: ContextProps
    ): Promise<PostDocument> {
        const { _id: userId } = context.req.user;
        return this.postService.addPostView(new Types.ObjectId(postId), userId);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => User)
    async followHashtag(
        @Args('tagId') tagId: string,
        @Context() context: ContextProps
    ): Promise<User> {
        const { _id: userId } = context.req.user;
        return this.hashtagsService.followHashtag(
            new Types.ObjectId(tagId),
            userId
        );
    }

    // -------- SCHEDULE POSTS -----------

    @UseGuards(AuthGuard)
    @Query(() => [Post], { nullable: true })
    async getSchedulePosts(
        @Context() context: ContextProps
    ): Promise<PostDocument[]> {
        const currentUserId = context.req.user._id;
        return this.postService.getSchedulePosts(currentUserId);
    }

    // -------- SOCIAL PLATFORMS SHARING (REFREELS) -----------

    @UseGuards(AuthGuard)
    @Mutation(() => VerifyEmailOutput)
    async postOnTwitter(
        @Args('createTwitterPostInput')
        createTwitterPostInput: CreateTwitterPostInput,
        @Context()
        context: ContextProps
    ): Promise<VerifyEmailOutput> {
        const user = context.req.user;
        this.postService.postTweet(
            createTwitterPostInput.text,
            createTwitterPostInput.media,
            user.twitterAccessToken,
            user.twitterAccessSecret
        );

        if (createTwitterPostInput?.refVideo) {
            await this.referralVideoService.findOneAndUpdate(
                { _id: new Types.ObjectId(createTwitterPostInput?.refVideo) },
                { $addToSet: { twitter: user._id } }
            );
        }

        return { success: true };
    }
}
