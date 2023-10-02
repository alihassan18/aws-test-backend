import {
    Resolver,
    Query,
    Mutation,
    Args,
    Int,
    // ResolveField,
    // Parent,
    Context
} from '@nestjs/graphql';
import { ContentCreatorService } from './content.creator.service';
import {
    ContentCreator
    // ContentCreatorDocument
} from './entities/content.creator.entity';
import {
    ContentCreatorFilterInput,
    ContentCreatorResponse,
    CreateContentCreatorInput
} from './dto/create-content.creator.input';
import { UpdateContentCreatorInput } from './dto/update-content.creator.input';
import { UseGuards /* UseInterceptors */ } from '@nestjs/common';
// import { GraphqlCacheInterceptor } from 'src/interceptors/graphql-cache.interceptor';
import { FilterQuery } from 'mongoose';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { ContextProps } from 'src/interfaces/common.interface';

@Resolver(() => ContentCreator)
export class ContentCreatorResolver {
    // eslint-disable-next-line no-unused-vars
    constructor(
        private readonly collectionsService: ContentCreatorService,
        private readonly userService: UsersService
    ) {}

    @UseGuards(AuthGuard)
    @Mutation(() => ContentCreator)
    createContentCreator(
        @Args('createContentCreatorInput')
        createContentCreatorInput: CreateContentCreatorInput,
        @Context()
        context: ContextProps
    ) {
        const user = context.req.user;
        return this.collectionsService.create(
            createContentCreatorInput,
            user?._id
        );
    }

    @Query(() => ContentCreatorResponse, { name: 'collections' })
    // @UseInterceptors(GraphqlCacheInterceptor)
    async collections(
        @Args('query', {
            type: () => ContentCreatorFilterInput,
            nullable: true
        })
        query: FilterQuery<ContentCreatorFilterInput>,
        @Args('limit', { type: () => Int, defaultValue: 10, nullable: true })
        limit: number,
        @Args('cursor', { type: () => String, nullable: true }) cursor?: string
    ): Promise<ContentCreatorResponse> {
        return this.collectionsService.findAll(query, limit, cursor);
    }

    @Query(() => ContentCreator, { name: 'collection' })
    findOne(
        @Args('address', { type: () => String }) address: string,
        @Args('chain', { type: () => String }) chain: string
    ) {
        return this.collectionsService.findByAddressAndChain(address, chain);
    }

    // @ResolveField(() => ContentCreator)
    // async owner(@Parent() collection: ContentCreator): Promise<UserDocument> {
    //     return this.userService.findByAddress(collection?.owner);
    // }

    @Query(() => ContentCreator)
    collectionFindById(
        @Args('id', { type: () => String }) id: string
    ): Promise<ContentCreator> {
        return this.collectionsService.findById(id);
    }

    @Mutation(() => ContentCreator)
    updateContentCreator(
        @Args('updateContentCreatorInput')
        updateContentCreatorInput: UpdateContentCreatorInput
    ) {
        return this.collectionsService.update(
            updateContentCreatorInput.id,
            updateContentCreatorInput
        );
    }

    @Mutation(() => ContentCreator)
    removeContentCreator(@Args('id', { type: () => Int }) id: number) {
        return this.collectionsService.remove(id);
    }
}
