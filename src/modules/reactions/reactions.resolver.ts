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
import { Reaction, ReactionDocument } from './entities/reaction.entity';
import { ReactionService } from './reactions.service';
import { Types } from 'mongoose';
import { GetReactions, GetTopReactions } from './dto/create-reaction.input';
import { User, UserDocument } from '../users/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ContextProps } from 'src/interfaces/common.interface';
import { UsersService } from '../users/users.service';
import { ReactionType } from './reactions.enums';
import {
    CollectionInput,
    TokenInput,
    UpdateNftForPost
} from '../feeds/dto/update-feed.input';

@Resolver(() => Reaction)
export class ReactionsResolver {
    constructor(
        private readonly reactionService: ReactionService,
        private readonly userService: UsersService
    ) {}

    @ResolveField(() => User)
    async user(@Parent() reaction: Reaction): Promise<UserDocument> {
        return this.userService.findById(new Types.ObjectId(reaction?.user));
    }

    @Query(() => GetReactions)
    async reactions(
        @Args('postId') postId: string,
        @Args('limit', { type: () => Number, defaultValue: 10 }) limit?: number,
        @Args('cursor', { type: () => String, nullable: true }) cursor?: string
    ): Promise<{ reactions: Reaction[]; endCursor: string }> {
        return await this.reactionService.getReactionsWithCursor(
            new Types.ObjectId(postId),
            limit,
            cursor
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Reaction)
    async addReactionToPost(
        @Args('postId', { nullable: true }) postId: string,
        @Args('emoji', { type: () => String }) emoji: ReactionType,
        @Args('collectionId', { nullable: true }) collectionId: string,
        @Args('nftTokenData', { nullable: true })
        nftTokenData: UpdateNftForPost,
        @Args('stakingCollectionId', { nullable: true })
        stakingId: string,
        @Args('collection', { nullable: true }) collection: CollectionInput,
        @Args('token', { nullable: true }) token: TokenInput,
        @Context() context: ContextProps
    ): Promise<Reaction> {
        const { _id: userId } = context.req.user;
        return await this.reactionService.addReactionToPost(
            postId,
            userId,
            emoji,
            collectionId,
            nftTokenData,
            stakingId,
            collection,
            token
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Reaction)
    async removeReactionForPost(
        @Args('postId') postId: string,
        @Context() context: ContextProps
    ): Promise<Reaction> {
        const { _id: userId } = context.req.user;
        return await this.reactionService.removeReactionForPost(
            userId,
            new Types.ObjectId(postId)
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Reaction)
    async toggleReactionForPost(
        @Args('postId') postId: string,
        @Args('emoji', { type: () => String }) emoji: ReactionType,
        @Context() context: ContextProps
    ): Promise<Reaction> {
        const { _id: userId } = context.req.user;
        return await this.reactionService.toggleReactionForPost(
            new Types.ObjectId(postId),
            userId,
            emoji
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Reaction)
    async addReactionToMessage(
        @Args('messageId') messageId: string,
        @Args('emoji', { type: () => String }) emoji: ReactionType,
        @Context() context: ContextProps
    ): Promise<Reaction> {
        const { _id: userId } = context.req.user;
        return await this.reactionService.addReactionToMessage(
            new Types.ObjectId(messageId),
            userId,
            emoji
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Reaction)
    async removeReactionForMessage(
        @Args('messageId') messageId: string,
        @Args('emoji') emoji: string,
        @Context() context: ContextProps
    ): Promise<Reaction> {
        const { _id: userId } = context.req.user;
        return await this.reactionService.removeReactionForMessage(
            userId,
            new Types.ObjectId(messageId),
            emoji
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Reaction)
    async toggleReactionForMessage(
        @Args('messageId') messageId: string,
        @Args('emoji', { type: () => String }) emoji: ReactionType,
        @Context() context: ContextProps
    ): Promise<Reaction> {
        const { _id: userId } = context.req.user;
        return await this.reactionService.toggleReactionForMessage(
            new Types.ObjectId(messageId),
            userId,
            emoji
        );
    }

    @UseGuards(AuthGuard)
    @Query(() => Reaction, { nullable: true })
    async getUserReaction(
        @Args('postId') postId: string,
        @Args('emoji', { nullable: true }) emoji: string,
        @Context() context: ContextProps
    ): Promise<Reaction> {
        const { _id: userId } = context.req.user;
        return await this.reactionService.getUserReaction(
            new Types.ObjectId(postId),
            userId,
            emoji
        );
    }

    @Query(() => Int)
    async countReactionsForPost(
        @Args('postId') postId: string
    ): Promise<number> {
        return await this.reactionService.countReactionsForPost(
            new Types.ObjectId(postId)
        );
    }

    @Query(() => [GetTopReactions])
    async getTopReactions(
        @Args('postId') postId: string,
        @Args('limit', { type: () => Number, nullable: true }) limit?: number
    ): Promise<Array<{ emoji: ReactionType; count: number }>> {
        return await this.reactionService.getTopReactions(
            new Types.ObjectId(postId),
            limit
        );
    }

    @UseGuards(AuthGuard)
    @Query(() => Boolean)
    async hasUserReactedToPost(
        @Args('postId') postId: string,
        @Context() context: ContextProps
    ): Promise<boolean> {
        const { _id: userId } = context.req.user;
        return this.reactionService.hasUserReactedToPost(
            userId,
            new Types.ObjectId(postId)
        );
    }

    @UseGuards(AuthGuard)
    @Query(() => Boolean)
    async hasUserReactedToMessage(
        @Args('messageId') messageId: string,
        @Context() context: ContextProps
    ): Promise<boolean> {
        const { _id: userId } = context.req.user;
        return this.reactionService.hasUserReactedToMessage(
            userId,
            new Types.ObjectId(messageId)
        );
    }

    @UseGuards(AuthGuard)
    @Query(() => [Reaction])
    async userReactionsOnPost(
        @Args('postId') postId: string,
        @Context() context: ContextProps
    ): Promise<ReactionDocument[]> {
        const { _id: userId } = context.req.user;
        return this.reactionService.userReactionsOnPost(
            userId,
            new Types.ObjectId(postId)
        );
    }

    @UseGuards(AuthGuard)
    @Query(() => [Reaction])
    async userReactiononsMessage(
        @Args('messageId') messageId: string,
        @Context() context: ContextProps
    ): Promise<ReactionDocument[]> {
        const { _id: userId } = context.req.user;
        return this.reactionService.userReactiononsMessage(
            userId,
            new Types.ObjectId(messageId)
        );
    }

    @UseGuards(AuthGuard)
    @Query(() => Reaction)
    async getUserByPostReaction(
        @Args('postId') postId: string,
        @Args('emoji') emoji: string
    ): Promise<ReactionDocument> {
        const result = await this.reactionService.getUserByPostReaction(
            emoji,
            new Types.ObjectId(postId)
        );
        if (result) return result;
        throw new Error('No reaction found');
    }
}
