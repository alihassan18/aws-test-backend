import {
    Resolver,
    Query,
    Mutation,
    Args,
    ResolveField,
    Parent,
    Context
} from '@nestjs/graphql';
import { RecentSearchesService } from './recent_searches.service';
import { RecentSearch } from './entities/recent_search.entity';
import { CreateRecentSearchInput } from './dto/create-recent_search.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Collection } from '../collections/entities/collection.entity';
import { CollectionsService } from '../collections/collections.service';
import { HashtagsService } from '../feeds/hashtags.service';
import { Hashtag, HashtagDocument } from '../feeds/entities/hashtag.entity';
import { User, UserDocument } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ContextProps } from 'src/interfaces/common.interface';

@Resolver(() => RecentSearch)
export class RecentSearchesResolver {
    constructor(
        private readonly recentSearchesService: RecentSearchesService,
        private readonly collectionService: CollectionsService,
        private readonly hashtagsService: HashtagsService,
        private readonly userService: UsersService
    ) {}

    @ResolveField(() => Collection)
    async _collection(
        @Parent() recentSearch: RecentSearch
    ): Promise<Collection> {
        return this.collectionService.findById(recentSearch._collection);
    }

    @ResolveField(() => Hashtag)
    async hashtag(
        @Parent() recentSearch: RecentSearch
    ): Promise<HashtagDocument> {
        return this.hashtagsService.findHashtagByName(recentSearch.hashtag);
    }

    @ResolveField(() => User)
    async userToSearch(
        @Parent() recentSearch: RecentSearch
    ): Promise<UserDocument> {
        return this.userService.findById(recentSearch.userToSearch);
    }

    @Mutation(() => RecentSearch)
    @UseGuards(AuthGuard)
    createRecentSearch(
        @Args('createRecentSearchInput')
        createRecentSearchInput: CreateRecentSearchInput,
        @Context() context: ContextProps
    ) {
        const { _id: userId } = context.req.user;

        return this.recentSearchesService.create(
            createRecentSearchInput,
            userId
        );
    }

    @Query(() => [RecentSearch], { name: 'recentSearches' })
    @UseGuards(AuthGuard)
    findAll(@Context() context: ContextProps) {
        const { _id: userId } = context.req.user;

        return this.recentSearchesService.findAll(userId);
    }

    @Mutation(() => RecentSearch)
    @UseGuards(AuthGuard)
    removeRecentSearch(@Args('id', { type: () => String }) id: string) {
        return this.recentSearchesService.remove(id);
    }

    @Mutation(() => RecentSearch)
    @UseGuards(AuthGuard)
    removeAllRecentSearch(@Context() context: ContextProps) {
        const { _id: userId } = context.req.user;
        return this.recentSearchesService.removeAll(userId);
    }
}
