import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Feed } from './entities/feed.entity';
import { Hashtag, HashtagDocument } from './entities/hashtag.entity';
import { HashtagsService } from './hashtags.service';
import { User, UserDocument } from '../users/entities/user.entity';
import { Post, PostDocument } from './entities/post.entity';
import { UsersService } from '../users/users.service';
import { Last24HrsHashtagCount } from './entities/hashcount.entity';

@Resolver(() => Feed)
export class HashtagsResolver {
    constructor(
        private readonly hashtagsService: HashtagsService,
        private readonly userService: UsersService
    ) {}

    @Query(() => Hashtag, { name: 'hashtag' })
    hashtag(@Args('name', { type: () => String }) name: string) {
        return this.hashtagsService.findHashtagByName(name);
    }

    @Query(() => [Hashtag])
    async searchHashtags(
        @Args('query') query: string
    ): Promise<HashtagDocument[]> {
        return this.hashtagsService.searchHashtags(query);
    }

    @Query(() => [Hashtag], { name: 'getTopHashtags' })
    async getTopHashtags(
        @Args('limit', { type: () => Number, defaultValue: 5 }) limit: number
    ): Promise<Hashtag[]> {
        return this.hashtagsService.findTopHashtags(limit);
    }

    @Query(() => [Last24HrsHashtagCount], { name: 'getTopHashtagsByDays' })
    async getTopHashtagsByDays(): Promise<Last24HrsHashtagCount[]> {
        // query: string // @Args('query', { type: () => String, defaultValue: '' }) // limit: number, // @Args('limit', { type: () => Number, defaultValue: -1 }) // days: number, // @Args('days', { type: () => Number, defaultValue: 1 })
        return this.hashtagsService.findTopHashtagsByDays();
    }

    // -------- USERS WHO USE THIS HASHTAG IN LAST 24HRS -----------

    @ResolveField(() => User)
    async author(@Parent() post: Post): Promise<UserDocument> {
        return this.userService.findById(post.author);
    }

    // @UseGuards(AuthGuard)
    @Query(() => [Post], { nullable: true })
    async usersUseHashtag(
        @Args('hashtag') hashtag: string
    ): Promise<PostDocument[]> {
        return this.hashtagsService.usersUseHashtag(hashtag);
    }

    // ---- FOLLOW HASHTAG USERS --------

    @Query(() => [User])
    async hashtagFollowersUsers(
        @Args('hashtag') hashtag: string
    ): Promise<UserDocument[]> {
        return this.hashtagsService.hashtagFollowersUsers(hashtag);
    }
}
