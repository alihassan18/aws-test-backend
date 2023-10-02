import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RwFightLbService } from './rw_fight-lb.service';
import { RwFightLb } from './entities/rw_fight-lb.entity';
import { CreateRwFightLbInput } from './dto/create-rw_fight-lb.input';
import { BadRequestException } from '@nestjs/common';

@Resolver(() => RwFightLb)
export class RwFightLbResolver {
    constructor(private readonly rwFightLbService: RwFightLbService) {}

    @Mutation(() => RwFightLb)
    rw_requestFightLB(
        @Args('createRwFightLbInput') createRwFightLbInput: CreateRwFightLbInput
    ) {
        return this.rwFightLbService.create(createRwFightLbInput);
    }

    @Query(() => [RwFightLb])
    rw_fightsLB(@Args('count', { nullable: true }) count: number) {
        return this.rwFightLbService.findAll(count);
    }

    // @Query(() => [RwFightLb])
    // rw_fightsLBRank(@Args('count', { nullable: true }) count: number) {
    //     return this.rwFightLbService.rw_fightsLBRank(count);
    // }

    @Query(() => RwFightLb)
    async rw_fightsLBYesterdayRank() {
        const res = await this.rwFightLbService.rw_fightsLBYesterdayRank();
        if (res) return res;
        throw new BadRequestException('No any rank found yesterday');
    }

    @Query(() => RwFightLb)
    async rw_fightsLBWeeklyRank() {
        const res = await this.rwFightLbService.rw_fightsLBWeeklyRank();
        if (res) return res;
        throw new BadRequestException('No any rank found of last week');
    }
}
