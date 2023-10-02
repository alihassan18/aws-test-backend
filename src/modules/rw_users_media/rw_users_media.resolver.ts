import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { RwUsersMediaService } from './rw_users_media.service';
import { RwUsersMedia } from './entities/rw_users_media.entity';
import { CreateRwUsersMediaInput } from './dto/create-rw_users_media.input';
import { AuthGuard } from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { ContextProps } from 'src/interfaces/common.interface';
import { Types } from 'mongoose';

@Resolver(() => RwUsersMedia)
export class RwUsersMediaResolver {
    constructor(private readonly rwUsersMediaService: RwUsersMediaService) {}

    @Mutation(() => RwUsersMedia)
    @UseGuards(AuthGuard)
    rw_uMediaCreate(
        @Args('createRwUsersMediaInput')
        createRwUsersMediaInput: CreateRwUsersMediaInput,
        @Context() ctx: ContextProps
    ) {
        const { _id } = ctx.req.user;
        return this.rwUsersMediaService.create(createRwUsersMediaInput, _id);
    }

    @Query(() => [RwUsersMedia])
    @UseGuards(AuthGuard)
    rw_uMedias(@Context() ctx: ContextProps) {
        const { _id } = ctx.req.user;
        return this.rwUsersMediaService.findAll(_id);
    }

    @Query(() => [RwUsersMedia])
    @UseGuards(AuthGuard)
    rw_uMediasSS(@Context() ctx: ContextProps) {
        const { _id } = ctx.req.user;
        return this.rwUsersMediaService.findAll(_id, 'isSS');
    }

    @Query(() => [RwUsersMedia])
    @UseGuards(AuthGuard)
    rw_uMediasSR(@Context() ctx: ContextProps) {
        const { _id } = ctx.req.user;
        return this.rwUsersMediaService.findAll(_id, 'isSR');
    }

    @Query(() => [RwUsersMedia])
    @UseGuards(AuthGuard)
    rw_uMediasFvrts(@Context() ctx: ContextProps) {
        const { _id } = ctx.req.user;
        return this.rwUsersMediaService.findAll(_id, 'isFavourite');
    }

    @Query(() => [RwUsersMedia])
    @UseGuards(AuthGuard)
    rw_uMediasReports(@Context() ctx: ContextProps) {
        const { _id } = ctx.req.user;
        return this.rwUsersMediaService.findAll(_id, 'isReport');
    }

    @Query(() => [RwUsersMedia])
    @UseGuards(AuthGuard)
    rw_uMediasReposts(@Context() ctx: ContextProps) {
        const { _id } = ctx.req.user;
        return this.rwUsersMediaService.findAll(_id, 'isRepost');
    }

    @Mutation(() => RwUsersMedia)
    @UseGuards(AuthGuard)
    rw_uMediaCreateFvrt(
        @Args('id', { type: () => String }) id: Types.ObjectId,
        @Args('status') status: boolean
    ) {
        return this.rwUsersMediaService.favorite(id, status);
    }

    // --- report api is diffrent

    @Mutation(() => RwUsersMedia)
    @UseGuards(AuthGuard)
    rw_uMediaCreateReport(
        @Args('id', { type: () => String }) id: Types.ObjectId
    ) {
        return this.rwUsersMediaService.report(id);
    }

    @Mutation(() => RwUsersMedia)
    @UseGuards(AuthGuard)
    rw_uMediaCreateRepost(
        @Args('id', { type: () => String }) id: Types.ObjectId
    ) {
        return this.rwUsersMediaService.repost(id);
    }

    @Mutation(() => String)
    @UseGuards(AuthGuard)
    removeRwUsersMedia(@Args('id', { type: () => String }) id: Types.ObjectId) {
        return this.rwUsersMediaService.remove(id);
    }
}
