import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UtilityService } from './utilities.service';
import { Utility, UtilityDocument } from './entities/utilities.entity';
import { CreateUtilityInput } from './dto/create-utilities.input';
import {
    UtilityFilterInput,
    UpdateUtilityInput
} from './dto/update-utilities.input';
import { FilterQuery } from 'mongoose';

@Resolver(() => Utility)
export class UtilityResolver {
    constructor(private readonly metaverseService: UtilityService) {}

    @Mutation(() => Utility)
    createUtility(
        @Args('createUtilityInput')
        createUtilityInput: CreateUtilityInput
    ) {
        return this.metaverseService.create(createUtilityInput);
    }

    @Query(() => [Utility], { name: 'utilities' })
    findAll(
        @Args('query', { type: () => UtilityFilterInput, nullable: true })
        query: FilterQuery<UtilityDocument>
    ) {
        return this.metaverseService.findAll(query);
    }

    @Query(() => Utility, { name: 'utility' })
    findOne(@Args('id', { type: () => Int }) id: string) {
        return this.metaverseService.findOne(id);
    }

    @Mutation(() => Utility)
    updateUtility(
        @Args('updateUtilityInput')
        updateUtilityInput: UpdateUtilityInput
    ) {
        return this.metaverseService.update(
            updateUtilityInput.id,
            updateUtilityInput
        );
    }

    @Mutation(() => Utility)
    removeListing(@Args('id', { type: () => String }) id: string) {
        return this.metaverseService.remove(id);
    }
}
