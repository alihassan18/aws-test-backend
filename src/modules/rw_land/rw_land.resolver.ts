import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RwLandService } from './rw_land.service';
import { RwLand } from './entities/rw_land.entity';
import { CreateRwLandInput } from './dto/create-rw_land.input';
import { Types } from 'mongoose';
import { AuthGuard } from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => RwLand)
export class RwLandResolver {
    constructor(private readonly rwLandService: RwLandService) {}

    @Query(() => String)
    @UseGuards(AuthGuard)
    // rw_lands(@Args('search', { nullable: true }) search: string) {
    rw_lands() {
        return this.rwLandService.findAll();
    }

    @Query(() => RwLand)
    @UseGuards(AuthGuard)
    rw_landById(@Args('id') id: string) {
        return this.rwLandService.findOne(id);
    }

    @Mutation(() => RwLand)
    @UseGuards(AuthGuard)
    rw_landCreate(
        @Args('createRwLandInput') createRwLandInput: CreateRwLandInput
    ) {
        return this.rwLandService.create(createRwLandInput);
    }

    @Mutation(() => RwLand)
    @UseGuards(AuthGuard)
    rw_landRemove(@Args('id', { type: () => String }) id: Types.ObjectId) {
        return this.rwLandService.remove(id);
    }
}
