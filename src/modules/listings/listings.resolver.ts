import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ListingsService } from './listings.service';
import { Listing } from './entities/listing.entity';
import {
    CreateListingInput,
    FindListingsQuery,
    ListingsResponse
} from './dto/create-listing.input';
import { UpdateListingInput } from './dto/update-listing.input';

@Resolver(() => Listing)
export class ListingsResolver {
    constructor(private readonly listingsService: ListingsService) {}

    @Mutation(() => Listing)
    createListing(
        @Args('createListingInput') createListingInput: CreateListingInput
    ) {
        return this.listingsService.create(createListingInput);
    }

    @Query(() => ListingsResponse, { name: 'listings' })
    findAll(
        @Args('query', { type: () => FindListingsQuery })
        query: FindListingsQuery
    ) {
        return this.listingsService.findAll(query);
    }

    @Query(() => Listing, { name: 'listing' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.listingsService.findOne(id);
    }

    @Mutation(() => Listing)
    updateListing(
        @Args('updateListingInput') updateListingInput: UpdateListingInput
    ) {
        return this.listingsService.update(
            updateListingInput.id,
            updateListingInput
        );
    }

    @Mutation(() => Listing)
    removeListing(@Args('id', { type: () => Int }) id: number) {
        return this.listingsService.remove(id);
    }
}
