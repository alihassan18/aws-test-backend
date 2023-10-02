import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import {
    IslandOwner,
    IslandOwnerItem,
    IslandUser,
    LeaderBoard,
    Mrland,
    MrlandDocument,
    Mrlands
} from './entities/mrland.entity';
import { LandmapService } from './landmap.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Island } from './entities/island.entity';
import { ContextProps } from 'src/interfaces/common.interface';
import { Types } from 'mongoose';
import { CreateMrlandEventInput } from './dto/create-event.input';

@Resolver(() => LeaderBoard)
export class MrlandResolver {
    constructor(private readonly landmapService: LandmapService) {}

    // @ResolveField(() => User)
    // async owner(@Parent() leaderBoard: LeaderBoard): Promise<UserDocument> {
    //     return this.userService.findById(leaderBoard.owner);
    // }

    // @ResolveField(() => Island)
    // async island(@Parent() leaderBoard: LeaderBoard): Promise<IslandDocument> {
    //     return this.landmapService.findIslandById(leaderBoard.island);
    // }

    @Query(() => LeaderBoard)
    async leaderboard(@Args('islandNum') islandNum: number) {
        return await this.landmapService.leaderboard(islandNum);
    }

    @Query(() => [LeaderBoard])
    async leaderboards() {
        return await this.landmapService.leaderboards;
    }
    @Query(() => [IslandUser])
    async getTopGlobal() {
        return await this.landmapService.topGlobal();
    }

    @Query(() => IslandUser)
    async searchUserByWallet(@Args('wallet') wallet: string) {
        const user = await this.landmapService.getUserByWallet(wallet);
        if (!user) return null;
        const count = await this.landmapService.getUserMrlandCount(
            new Types.ObjectId(user._id)
        );
        return { user: [user], count };
    }

    @Query(() => [IslandOwner])
    async getIslandOwnersInfo(@Args('cnt') cnt: number) {
        return await this.landmapService.getIslandOwnersInfo(cnt);
    }

    @Query(() => Mrlands)
    async nfts() {
        return await this.landmapService.nfts();
    }

    @Query(() => Mrlands)
    async nftsAddress(@Args('owner') owner: string) {
        return await this.landmapService.nftsAddress(owner);
    }

    @Query(() => Mrlands)
    async nftsListing() {
        return await this.landmapService.nftsListing();
    }

    @Query(() => [Island])
    async islands() {
        return await this.landmapService.islands();
    }

    @Query(() => [IslandOwnerItem])
    async islandOwners() {
        return await this.landmapService.islandOwners();
    }

    @Query(() => Mrland)
    async getMrLandById(@Args('id') id: string) {
        return await this.landmapService.findMrLand(new Types.ObjectId(id));
    }

    @UseGuards(AuthGuard)
    @Mutation(() => [Mrland])
    async updateLandProfile(
        @Args('landId') landId: string,
        @Args('name') name: string,
        @Args('description') description: string,
        @Args('logo') logo: string,
        @Args('applyAll') applyAll: boolean,
        @Context() context: ContextProps
    ) {
        const { wallet } = context.req.user;
        return await this.landmapService.updateLand(
            wallet,
            landId,
            name,
            description,
            logo,
            applyAll
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Island)
    async updateIslandProfile(
        @Args('islandId') islandId: string,
        @Args('name') name: string,
        @Args('description') description: string,
        @Args('logo') logo: string
    ) {
        return await this.landmapService.updateIsland(
            islandId,
            name,
            description,
            logo
        );
    }

    @Mutation(() => Boolean)
    async getMrlandEvent(
        @Args('events', {
            type: () => CreateMrlandEventInput
        })
        events: CreateMrlandEventInput
    ) {
        console.log('Mrland Event listened: ', events);
        return await this.landmapService.updateMrlands(events);
    }

    @Mutation(() => Mrland)
    async updateLandForPost(@Args('id') id: string) {
        return await this.landmapService.updateMrlandForPost(id);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Mrland)
    async likeMrLand(
        @Args('landId', { nullable: true }) landId: string,
        @Context() context: ContextProps
    ): Promise<MrlandDocument> {
        const { _id: userId } = context.req.user;
        return this.landmapService.likeMrLand(landId, userId);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Mrland)
    async dislikeMrLand(
        @Args('landId', { nullable: true }) landId: string,
        @Context() context: ContextProps
    ): Promise<MrlandDocument> {
        const { _id: userId } = context.req.user;
        return this.landmapService.dislikeMrLand(landId, userId);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Mrland)
    async mrland_active(
        @Args('landId') landId: number,
        @Args('billboard') billboard: boolean
    ): Promise<MrlandDocument> {
        return this.landmapService.mrland_active(landId, billboard);
    }
}
