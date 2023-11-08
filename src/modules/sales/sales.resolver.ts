import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SalesService } from './sales.service';
import { Sales } from './entities/sales.entity';
import {
    CreateSalesInput,
    FindSalesQuery,
    SalesResponse
} from './dto/create-sales.input';
import { UpdateSalesInput } from './dto/update-sales.input';

@Resolver(() => Sales)
export class SalesResolver {
    constructor(private readonly bidsService: SalesService) {}

    @Mutation(() => Sales)
    createSales(@Args('createSalesInput') createSalesInput: CreateSalesInput) {
        return this.bidsService.create(createSalesInput);
    }

    @Query(() => SalesResponse, { name: 'histories' })
    findAll(
        @Args('query', { type: () => FindSalesQuery })
        query: FindSalesQuery
    ) {
        return this.bidsService.findAll(query);
    }

    @Query(() => Sales, { name: 'history' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.bidsService.findOne(id);
    }

    @Mutation(() => Sales)
    updateSales(@Args('updateSalesInput') updateSalesInput: UpdateSalesInput) {
        return this.bidsService.update(updateSalesInput.id, updateSalesInput);
    }

    @Mutation(() => Sales)
    removeSales(@Args('id', { type: () => Int }) id: number) {
        return this.bidsService.remove(id);
    }
}
