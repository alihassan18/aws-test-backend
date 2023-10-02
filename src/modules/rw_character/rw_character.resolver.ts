import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { RwCharacterService } from './rw_character.service';
import { RwCharacter } from './entities/rw_character.entity';
import { CreateRwCharacterInput } from './dto/create-rw_character.input';
import { UpdateRwCharacterInput } from './dto/update-rw_character.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ContextProps } from 'src/interfaces/common.interface';

@Resolver(() => RwCharacter)
export class RwCharacterResolver {
    constructor(private readonly rwCharacterService: RwCharacterService) {}

    @Mutation(() => RwCharacter)
    @UseGuards(AuthGuard)
    rw_characterCreate(
        @Args('createRwCharacterInput')
        createRwCharacterInput: CreateRwCharacterInput,
        @Context() ctx: ContextProps
    ) {
        const { _id } = ctx.req.user;
        return this.rwCharacterService.create(createRwCharacterInput, _id);
    }

    @Query(() => RwCharacter)
    @UseGuards(AuthGuard)
    async rw_character(@Context() ctx: ContextProps) {
        const { _id } = ctx.req.user;
        const response = await this.rwCharacterService.findOne(_id);
        if (response) {
            return response;
        } else {
            return this.rwCharacterService.create(
                { skinColor: '0', gender: '3' },
                _id
            );
        }

        // throw new BadRequestException('You have not addded your character yet');
    }

    @Mutation(() => RwCharacter)
    @UseGuards(AuthGuard)
    rw_characterUpdate(
        @Args('updateRwCharacterInput')
        updateRwCharacterInput: UpdateRwCharacterInput,
        @Context() ctx: ContextProps
    ) {
        const { _id } = ctx.req.user;

        return this.rwCharacterService.update(_id, updateRwCharacterInput);
    }

    @Mutation(() => RwCharacter)
    @UseGuards(AuthGuard)
    rw_chracterRemove(@Context() ctx: ContextProps) {
        const { _id } = ctx.req.user;
        return this.rwCharacterService.remove(_id);
    }
}
