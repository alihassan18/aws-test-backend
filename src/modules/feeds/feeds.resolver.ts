import {
    Resolver,
    Query,
    Args,
    Int,
    ResolveField,
    Parent,
    Mutation,
    Context
} from '@nestjs/graphql';
import { FeedsService } from './feeds.service';
import {
    FeedConnection,
    FeedFilterInput,
    LinkPreviewResult
} from './dto/create-feed.input';
import { FilterQuery, Types } from 'mongoose';
import { PostDocument } from './entities/post.entity';
import { Feed, FeedDocument } from './entities/feed.entity';
import { UsersService } from '../users/users.service';
import { User, UserDocument } from '../users/entities/user.entity';
import { PostService } from './posts.service';
import { CollectionsService } from '../collections/collections.service';
import {
    Collection,
    CollectionDocument
} from '../collections/entities/collection.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ContextProps } from 'src/interfaces/common.interface';

@Resolver(() => Feed)
export class FeedsResolver {
    constructor(
        private readonly feedsService: FeedsService,
        private readonly postService: PostService,
        private readonly userService: UsersService,
        private readonly collectionService: CollectionsService
    ) {}

    @ResolveField(() => Feed)
    async post(@Parent() feed: Feed): Promise<PostDocument> {
        return this.postService.findById(feed?.post);
    }

    @ResolveField(() => Collection, { nullable: true })
    async _collection(@Parent() feed: Feed): Promise<CollectionDocument> {
        return this.collectionService.findById(feed?._collection);
    }

    @ResolveField(() => Feed)
    async owner(@Parent() feed: Feed): Promise<UserDocument> {
        return this.userService.findById(feed?.owner);
    }

    @Query(() => Feed, { name: 'feed' })
    feed(@Args('id', { type: () => String }) id: string) {
        return this.feedsService.findById(new Types.ObjectId(id));
    }

    @Query(() => FeedConnection, { name: 'feeds' })
    async feeds(
        @Args('query', { type: () => FeedFilterInput, nullable: true })
        query: FilterQuery<FeedDocument>,
        @Args('limit', { type: () => Int, defaultValue: 10 }) limit?: number,
        @Args('cursor', { type: () => String, nullable: true }) cursor?: string,
        @Args('loggedUserId', { type: () => String, nullable: true })
        loggedUserId?: string
    ): Promise<FeedConnection> {
        try {
            const { records, pageInfo } = await this.feedsService.findAllFeeds(
                query,
                limit,
                cursor,
                loggedUserId
            );
            return {
                records,
                pageInfo
            };
        } catch (error) {
            console.log(error, 'err in feeds', {
                limit,
                query,
                cursor,
                loggedUserId
            });
        }
    }

    @Query(() => LinkPreviewResult)
    async linkPreview(@Args('link') link: string): Promise<LinkPreviewResult> {
        return this.feedsService.linkPreview(link);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Feed)
    removeFeed(
        @Args('feedId', { type: () => String }) feedId: string,
        @Context() context: ContextProps
    ) {
        const { _id: userId } = context.req.user;
        return this.feedsService.remove(new Types.ObjectId(feedId), userId);
    }

    // ---------- USER FOLLOW HERE DUE TO PRIVATE GATEWAY ISSUE

    @UseGuards(AuthGuard)
    @Mutation(() => User)
    follow(
        @Context() context: ContextProps,
        @Args('id', { type: () => String }) id: string
    ) {
        const { _id: userId } = context.req.user;
        return this.feedsService.follow(id, userId);
    }
}
