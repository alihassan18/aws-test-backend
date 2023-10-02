import {
    Resolver,
    Query,
    Mutation,
    Args,
    ResolveField,
    Parent,
    Context
} from '@nestjs/graphql';
import { StakingCollectionService } from './staking.service';
import {
    StakingCollection,
    StakingCollectionDocument
} from './entities/collection.staking.entity';
import { CreateStakingCollectionInput } from './dto/create-staking.input';
import {
    StakingFilterInput,
    UpdateStakingCollectionInput
} from './dto/update-staking.input';
import { FilterQuery, Types } from 'mongoose';
import { Post, PostDocument } from '../feeds/entities/post.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ContextProps } from 'src/interfaces/common.interface';

@Resolver(() => StakingCollection)
export class StakingCollectionResolver {
    constructor(private readonly stakinService: StakingCollectionService) {}

    @ResolveField(() => Post)
    async post(@Parent() collection: StakingCollection): Promise<PostDocument> {
        return this.stakinService.postModel.findById(collection?.post);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => StakingCollection)
    createStakingCollection(
        @Args('createStakingCollectionInput')
        createStakingCollectionInput: CreateStakingCollectionInput,
        @Context()
        context: ContextProps
    ) {
        const user = context.req.user;
        // const user = {_id: new Types.ObjectId('647998f801ad7efb206dc2b1')}
        return this.stakinService.create(
            createStakingCollectionInput,
            user?._id
        );
    }

    @Query(() => [StakingCollection], { name: 'stakingCollections' })
    findAll(
        @Args('query', { type: () => StakingFilterInput, nullable: true })
        query: FilterQuery<StakingCollectionDocument>
    ) {
        return this.stakinService.findAll(query);
    }

    @Query(() => StakingCollection, { name: 'stakingCollection' })
    findOne(@Args('id', { type: () => String }) id: Types.ObjectId) {
        return this.stakinService.findOne(id);
    }

    @Mutation(() => StakingCollection)
    updateStakingCollection(
        @Args('updateStakingCollectionInput')
        updateStakingCollectionInput: UpdateStakingCollectionInput
    ) {
        return this.stakinService.update(
            updateStakingCollectionInput.id,
            updateStakingCollectionInput
        );
    }

    @Mutation(() => StakingCollection)
    removeListing(@Args('id', { type: () => String }) id: string) {
        return this.stakinService.remove(id);
    }
}
