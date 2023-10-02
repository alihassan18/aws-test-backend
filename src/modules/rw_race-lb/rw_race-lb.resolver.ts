import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RwRaceLbService } from './rw_race-lb.service';
import { RwRaceLb } from './entities/rw_race-lb.entity';
import { CreateRwRaceLbInput } from './dto/create-rw_race-lb.input';
import { BadRequestException } from '@nestjs/common';

@Resolver(() => RwRaceLb)
export class RwRaceLbResolver {
    constructor(private readonly rwRaceLbService: RwRaceLbService) {}

    @Mutation(() => RwRaceLb)
    rw_requestRaceLB(
        @Args('createRwRaceLbInput') createRwRaceLbInput: CreateRwRaceLbInput
    ) {
        return this.rwRaceLbService.create(createRwRaceLbInput);
    }

    @Query(() => [RwRaceLb])
    rw_racesLB(@Args('count', { nullable: true }) count: number) {
        return this.rwRaceLbService.findAll(count);
    }

    @Query(() => RwRaceLb)
    async rw_racesLBYesterdayRank() {
        const res = await this.rwRaceLbService.rw_racesLBYesterdayRank();
        if (res) return res;
        throw new BadRequestException('No any rank found yesterday');
    }

    @Query(() => RwRaceLb)
    async rw_fightsLBWeeklyRank() {
        const res = await this.rwRaceLbService.rw_fightsLBWeeklyRank();
        if (res) return res;
        throw new BadRequestException('No any rank found of last week');
    }
}
