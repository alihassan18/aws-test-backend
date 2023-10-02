import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { RwGameFlowerService } from './rw_game_flower.service';
import { RwGameFlower } from './entities/rw_game_flower.entity';
import { CreateRwGameFlowerInput } from './dto/create-rw_game_flower.input';
import { AuthGuard } from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { ContextProps } from 'src/interfaces/common.interface';

@Resolver(() => RwGameFlower)
export class RwGameFlowerResolver {
    constructor(private readonly rwGameFlowerService: RwGameFlowerService) {}

    @Mutation(() => RwGameFlower)
    @UseGuards(AuthGuard)
    rw_gameFlowerCreate(
        @Args('createRwGameFlowerInput')
        createRwGameFlowerInput: CreateRwGameFlowerInput,
        @Context() ctx: ContextProps
    ) {
        const { _id } = ctx.req.user;
        return this.rwGameFlowerService.create(createRwGameFlowerInput, _id);
    }

    @UseGuards(AuthGuard)
    @Query(() => RwGameFlower, { name: 'rw_gameFlower' })
    findOne(@Context() ctx: ContextProps) {
        const { _id } = ctx.req.user;
        return this.rwGameFlowerService.findOne(_id);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => RwGameFlower)
    removeRwGameFlower(@Context() ctx: ContextProps) {
        const { _id } = ctx.req.user;
        return this.rwGameFlowerService.remove(_id);
    }
}
