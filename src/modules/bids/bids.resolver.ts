import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BidsService } from './bids.service';
import { Bid } from './entities/bid.entity';
import {
    BidsResponse,
    CreateBidInput,
    FindBidsQuery
} from './dto/create-bid.input';
import { UpdateBidInput } from './dto/update-bid.input';

@Resolver(() => Bid)
export class BidsResolver {
    constructor(private readonly bidsService: BidsService) {}

    @Mutation(() => Bid)
    createBid(@Args('createBidInput') createBidInput: CreateBidInput) {
        return this.bidsService.create(createBidInput);
    }

    @Query(() => BidsResponse, { name: 'bids' })
    findAll(
        @Args('query', { type: () => FindBidsQuery })
        query: FindBidsQuery
    ) {
        return this.bidsService.findAll(query);
    }

    @Query(() => Bid, { name: 'bid' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.bidsService.findOne(id);
    }

    @Mutation(() => Bid)
    updateBid(@Args('updateBidInput') updateBidInput: UpdateBidInput) {
        return this.bidsService.update(updateBidInput.id, updateBidInput);
    }

    @Mutation(() => Bid)
    removeBid(@Args('id', { type: () => Int }) id: number) {
        return this.bidsService.remove(id);
    }
}
