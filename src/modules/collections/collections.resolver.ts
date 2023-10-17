import {
    Resolver,
    Query,
    Mutation,
    Args,
    Int,
    ResolveField,
    // Parent,
    Context,
    Parent
} from '@nestjs/graphql';
import { CollectionsService } from './collections.service';
import {
    Collection /* CollectionDocument */,
    CollectionDocument,
    LinkPreview
} from './entities/collection.entity';
import {
    CollectionFilterInput,
    CollectionResponse,
    CollectionSearchResults,
    CreateCollectionInput,
    CreateCollectionTokenInput
} from './dto/create-collection.input';
import { UpdateCollectionInput } from './dto/update-collection.input';
import { UseGuards /* UseInterceptors */ } from '@nestjs/common';
// import { GraphqlCacheInterceptor } from 'src/interceptors/graphql-cache.interceptor';
import { FilterQuery, Model } from 'mongoose';
import { UsersService } from '../users/users.service';
// import { UserDocument } from '../users/entities/user.entity';
import { ContextProps } from 'src/interfaces/common.interface';
import { AuthGuard } from '../auth/auth.guard';
import {
    ReservoirService /* chains */
} from '../shared/services/reservoir.service';
import {
    ReservoirCollectionResults,
    ReservoirSearchedCollection
} from '../reservoir/dto/reservoir.objecttypes';
import { CollectionQueryInput } from '../reservoir/dto/reservoir.inputtypes';
// import { OnEvent } from '@nestjs/event-emitter';
import { TradeDistribution } from './entities/collection.trade.entity';
import { Distributions } from './entities/collection.distributions';
import { Post, PostDocument } from '../feeds/entities/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/entities/user.entity';
import { NotificationService } from '../notifications/notification.service';
@Resolver(() => Collection)
export class CollectionsResolver {
    // eslint-disable-next-line no-unused-vars
    constructor(
        private readonly collectionsService: CollectionsService,
        private readonly userService: UsersService,
        private readonly reservoirService: ReservoirService,
        @InjectModel(Post.name)
        public postModel: Model<PostDocument>,
        private readonly notifcationService: NotificationService
    ) {}

    @ResolveField(() => Post)
    async post(@Parent() collection: Collection): Promise<PostDocument> {
        return this.postModel.findById(collection.post);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Collection)
    async createCollection(
        @Args('createCollectionInput')
        createCollectionInput: CreateCollectionInput,
        @Context()
        context: ContextProps
    ) {
        try {
            const user = context.req.user;
            const response = await this.collectionsService.create(
                createCollectionInput,
                user?._id
            );
            if (response) {
                this.notifcationService.alertFollowers4CCollection(
                    user._id,
                    user.userName,
                    response.chain,
                    response.contract,
                    response.image,
                    String(response.supply || ''),
                    response?._id?.toString()
                );
            }

            return response;
        } catch (error) {
            return error;
        }
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Collection)
    createToken(
        @Args('input')
        input: CreateCollectionTokenInput,
        @Args('contract')
        contract: string
        // @Context()
        // context: ContextProps
    ) {
        // const user = context.req.user;
        return this.collectionsService.createToken(input, contract);
    }

    @Query(() => CollectionResponse, { name: 'collections', nullable: true })
    // @UseInterceptors(GraphqlCacheInterceptor)
    async collections(
        @Args('query', { type: () => CollectionFilterInput, nullable: true })
        query: FilterQuery<CollectionFilterInput>,
        @Args('limit', { type: () => Int, defaultValue: 10, nullable: true })
        limit: number,
        @Args('page', { type: () => Int, nullable: true, defaultValue: 1 })
        page?: number
    ): Promise<CollectionResponse> {
        return this.collectionsService.findAll(query, page, limit);
    }

    // @Query(() => [Collection], { name: 'getMostViewedCollections' })
    // async mostViewedCollections() {
    //     return this.collectionsService.getMostViewed();
    // }

    @Query(() => Collection, { name: 'collection', nullable: true })
    collection(
        @Args('address', { type: () => String }) address: string,
        @Args('chain', { type: () => String }) chain: string
    ) {
        return this.collectionsService.findByAddressAndChain(address, chain);
    }

    @Query(() => LinkPreview, { name: 'collectionLinkPreview', nullable: true })
    collectionPreview(
        @Args('address', { type: () => String }) address: string,
        @Args('chain', { type: () => String }) chain: string
    ) {
        return this.collectionsService.getLinkPreview(address, chain);
    }

    @Query(() => Collection, { name: 'collectionById' })
    collectionById(@Args('id', { type: () => String }) id: string) {
        return this.collectionsService.findById(id);
    }

    // @ResolveField(() => Collection)
    // async owner(@Parent() collection: Collection): Promise<UserDocument> {
    //     return this.userService.findByAddress(collection?.owner);
    // }

    @Query(() => Collection, { nullable: true })
    collectionFindById(
        @Args('id', { type: () => String }) id: string
    ): Promise<Collection> {
        return this.collectionsService.findById(id);
    }

    @Mutation(() => Collection)
    updateCollection(
        @Args('updateCollectionInput')
        updateCollectionInput: UpdateCollectionInput
    ) {
        return this.collectionsService.update(
            updateCollectionInput.id,
            updateCollectionInput
        );
    }

    // @Mutation(() => Collection)
    // removeCollection(@Args('id', { type: () => Int }) id: number) {
    //     return this.collectionsService.remove(id);
    // }

    @Query(() => [ReservoirSearchedCollection]) // Assuming Collection is a GraphQL type you've defined
    async getSearchCollections(
        @Args('name', { type: () => String, nullable: true }) name: string,
        @Args('community', { type: () => String, nullable: true })
        community: string,
        @Args('displayCurrency', { type: () => String, nullable: true })
        displayCurrency: string,
        @Args('collectionsSetId', { type: () => String, nullable: true })
        collectionsSetId: string,
        @Args('offset', { type: () => Number, nullable: true }) offset: number,
        @Args('limit', { type: () => Number, nullable: true }) limit: number
    ) {
        try {
            return this.reservoirService.getSearchCollections({
                name,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                community,
                displayCurrency,
                collectionsSetId,
                offset,
                limit,
                accept: '*/*'
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    @Query(() => ReservoirCollectionResults) // Assuming Collection is a GraphQL type you've defined
    async getCollections(
        @Args('query', { type: () => CollectionQueryInput, nullable: true })
        query: CollectionQueryInput
    ) {
        try {
            return this.reservoirService.getCollections(query);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    @Query(() => [CollectionSearchResults]) // Assuming Collection is a GraphQL type you've defined
    async searchCollection(
        @Args('keyword', { type: () => String })
        keyword: string
    ) {
        try {
            return this.collectionsService.search(keyword);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    @Query(() => ReservoirCollectionResults, { nullable: true }) // Assuming Collection is a GraphQL type you've defined
    async findByConctractAddress(
        @Args('address', { type: () => String })
        address: string
    ) {
        try {
            return this.reservoirService.findByConctractAddress(address);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Collection)
    async toggleFollowCollection(
        @Args('collectionId') collectionId: string,
        @Context() ctx: ContextProps
    ) {
        const { _id: userId } = ctx.req.user;
        return this.collectionsService.toggleFollowCollection(
            userId,
            collectionId
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Collection)
    async updateTokenCount(
        @Args('collectionId') collectionId: string
        // @Context() ctx: ContextProps
    ) {
        // const { _id: userId } = ctx.req.user;
        return this.collectionsService.updateTokenCount(collectionId);
    }

    @Query(() => [TradeDistribution], { nullable: true })
    async getTradeDistribution(
        @Args('contract') contract: string,
        @Args('chain') chain: string,
        @Args('filter', { type: () => String }) filter: string
    ) {
        return this.collectionsService.findTradeDistribution(
            contract,
            chain,
            filter
        );
    }

    @Query(() => Distributions, { nullable: true })
    async findAmountAndPeriodDistributions(
        @Args('contract') contract: string,
        @Args('chain') chain: string
    ) {
        return this.collectionsService.findDistributions(contract, chain);
    }

    // @OnEvent('order.created')
    // handleOrderCreatedEvent(payload) {
    //     console.log(payload);

    //     // handle and process "OrderCreatedEvent" event
    // }

    // @OnEvent('collection.create.tokens')
    // fetchAllTokensByCollection(payload: { contract: string; chain: string }) {
    //     this.collectionsService.fetchAllTokensByCollection(
    //         payload?.contract,
    //         payload?.chain
    //     );
    // }

    // @OnEvent('collection.create.trades')
    // createCollectionTrades(payload: { contract: string; chain: string }) {
    //     this.collectionsService.createCollectionTrades(
    //         payload?.contract,
    //         payload?.chain
    //     );
    // }

    // @OnEvent('collection.create.amount')
    // createHoldingAmountDistribution(payload: {
    //     contract: string;
    //     chain: string;
    // }) {
    //     this.collectionsService.createHoldingAmountDistribution(
    //         payload?.contract,
    //         payload?.chain
    //     );
    // }

    // @OnEvent('collection.create.listings')
    // createListings(payload: { contract: string; chain: string }) {
    //     this.collectionsService.fetchAllListingsByCollection(
    //         payload?.contract,
    //         payload?.chain
    //     );
    // }

    // @OnEvent('collection.create.bids')
    // createBids(payload: { contract: string; chain: string }) {
    //     this.collectionsService.createBids(payload?.contract, payload?.chain);
    // }

    // @OnEvent('collection.create.history')
    // createActivities(payload: { contract: string; chain: string }) {
    //     this.collectionsService.createActivities(
    //         payload?.contract,
    //         payload?.chain
    //     );
    // }

    @Query(() => [User], {
        nullable: true,
        description: 'Search users who have created a collection'
    })
    async searchUsersWithCollection(
        @Args('keyword', { type: () => String, nullable: true }) keyword: string
    ): Promise<User[]> {
        // Use your collectionsService to find the collections based on the creatorName
        const users: User[] =
            await this.collectionsService.findCollectionsByCreatorName(keyword);

        return users;
    }

    @Query(() => Boolean, {
        nullable: true,
        description: 'Search users who have created a collection'
    })
    async startTradeEvents(
        @Args('contract', { type: () => String }) contract: string,
        @Args('chain', { type: () => String }) chain: string
    ): Promise<boolean> {
        // Use your collectionsService to find the collections based on the creatorName
        return this.collectionsService.startTradeEvents(contract, chain);
    }

    @Query(() => Boolean, {
        nullable: true,
        description: 'Search users who have created a collection'
    })
    async startBidsEvents(
        @Args('contract', { type: () => String }) contract: string,
        @Args('chain', { type: () => String }) chain: string
    ): Promise<boolean> {
        // Use your collectionsService to find the collections based on the creatorName
        return this.collectionsService.startBidsEvents(contract, chain);
    }

    @Query(() => Boolean, {
        nullable: true,
        description: 'Search users who have created a collection'
    })
    async startHistoryEvents(
        @Args('contract', { type: () => String }) contract: string,
        @Args('chain', { type: () => String }) chain: string
    ): Promise<boolean> {
        // Use your collectionsService to find the collections based on the creatorName
        return this.collectionsService.startHistoryEvents(contract, chain);
    }

    @Query(() => Boolean, {
        nullable: true,
        description: 'Search users who have created a collection'
    })
    async startListingEvents(
        @Args('contract', { type: () => String }) contract: string,
        @Args('chain', { type: () => String }) chain: string
    ): Promise<boolean> {
        // Use your collectionsService to find the collections based on the creatorName
        return this.collectionsService.startListingEvents(contract, chain);
    }

    @Query(() => Boolean, {
        nullable: true,
        description: 'Search users who have created a collection'
    })
    async startTokenEvents(
        @Args('contract', { type: () => String }) contract: string,
        @Args('chain', { type: () => String }) chain: string
    ): Promise<boolean> {
        // Use your collectionsService to find the collections based on the creatorName
        return this.collectionsService.startTokenEvents(contract, chain);
    }

    @Query(() => [Collection], {
        nullable: true,
        description: 'Search users who have created a collection'
    })
    async getMostViewedCollections(): Promise<CollectionDocument[]> {
        // Use your collectionsService to find the collections based on the creatorName
        return this.collectionsService.getMostViewedCollections();
    }

    // @Query(() => User, {
    //     nullable: true,
    //     description: 'Search users who have created a collection'
    // })
    // async currencyConvertor(
    //     @Args('keyword', { type: () => String, nullable: true }) keyword: string
    // ): Promise<User[]> {
    //     // Use your collectionsService to find the collections based on the creatorName
    //     const data = await this.reservoirService.currencyConvertor(keyword);
    //     console.log(data, 'data');

    //     return data;
    // }

    // @Cron(CronExpression.EVERY_HOUR)
    // async handleCron() {
    //     for (const key in chains) {
    //         if (Object.prototype.hasOwnProperty.call(chains, key)) {
    //             const element = chains[key];

    //             await this.reservoirService.insertTopCollections(
    //                 element?.routePrefix
    //             );
    //         }
    //     }
    // }
}
