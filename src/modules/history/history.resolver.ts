import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HistoryService } from './history.service';
import { History } from './entities/history.entity';
import {
    CreateHistoryInput,
    FindHistoryQuery,
    HistoryResponse
} from './dto/create-history.input';
import { UpdateHistoryInput } from './dto/update-history.input';

@Resolver(() => History)
export class HistoryResolver {
    constructor(private readonly bidsService: HistoryService) {}

    @Mutation(() => History)
    createHistory(
        @Args('createHistoryInput') createHistoryInput: CreateHistoryInput
    ) {
        return this.bidsService.create(createHistoryInput);
    }

    @Query(() => HistoryResponse, { name: 'histories' })
    findAll(
        @Args('query', { type: () => FindHistoryQuery })
        query: FindHistoryQuery
    ) {
        return this.bidsService.findAll(query);
    }

    @Query(() => History, { name: 'history' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.bidsService.findOne(id);
    }

    @Mutation(() => History)
    updateHistory(
        @Args('updateHistoryInput') updateHistoryInput: UpdateHistoryInput
    ) {
        return this.bidsService.update(
            updateHistoryInput.id,
            updateHistoryInput
        );
    }

    @Mutation(() => History)
    removeHistory(@Args('id', { type: () => Int }) id: number) {
        return this.bidsService.remove(id);
    }
}
