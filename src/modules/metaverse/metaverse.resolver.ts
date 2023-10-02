import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { MetaverseService } from './metaverse.service';
import { Metaverse, MetaverseDocument } from './entities/metaverse.entity';
import { CreateMetaverseInput } from './dto/create-metaverse.input';
import {
    MetaverseFilterInput,
    UpdateMetaverseInput
} from './dto/update-metaverse.input';
import { FilterQuery } from 'mongoose';

@Resolver(() => Metaverse)
export class MetaverseResolver {
    constructor(private readonly metaverseService: MetaverseService) {}

    @Mutation(() => Metaverse)
    createMetaverse(
        @Args('createMetaverseInput')
        createMetaverseInput: CreateMetaverseInput
    ) {
        return this.metaverseService.create(createMetaverseInput);
    }

    @Query(() => [Metaverse], { name: 'metaverses' })
    findAll(
        @Args('query', { type: () => MetaverseFilterInput, nullable: true })
        query: FilterQuery<MetaverseDocument>
    ) {
        return this.metaverseService.findAll(query);
    }

    @Query(() => Metaverse, { name: 'metaverse' })
    findOne(@Args('id', { type: () => Int }) id: string) {
        return this.metaverseService.findOne(id);
    }

    @Mutation(() => Metaverse)
    updateMetaverse(
        @Args('updateMetaverseInput')
        updateMetaverseInput: UpdateMetaverseInput
    ) {
        return this.metaverseService.update(
            updateMetaverseInput.id,
            updateMetaverseInput
        );
    }

    @Mutation(() => Metaverse)
    removeListing(@Args('id', { type: () => String }) id: string) {
        return this.metaverseService.remove(id);
    }
}
