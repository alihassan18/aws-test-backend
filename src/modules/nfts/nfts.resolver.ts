import {
    Resolver,
    Query,
    Mutation,
    Args,
    Int,
    Parent,
    ResolveField
} from '@nestjs/graphql';
import { NftsService } from './nfts.service';
import { Nft } from './entities/nft.entity';
import {
    CreateNftInput,
    HiddenTokensInput,
    TokenFilterInput,
    TokensCountsByStatus,
    TokensResponse,
    UserStats
} from './dto/create-nft.input';
import { UpdateNftInput } from './dto/update-nft.input';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from '../feeds/entities/post.entity';
import { InjectModel } from '@nestjs/mongoose';
import { LinkPreview } from '../collections/entities/collection.entity';
import { HiddenTokens } from './entities/nft.hidden.entity';
// import { Listing } from '../listings/entities/listing.entity';
// import { ListingsResolver } from '../listings/listings.resolver';

@Resolver(() => Nft)
export class NftsResolver {
    constructor(
        private readonly nftsService: NftsService, // private readonly listingService: ListingsResolver
        @InjectModel(Post.name)
        public postModel: Model<PostDocument>
    ) {}

    @ResolveField(() => Post)
    async post(@Parent() nftToken: Nft): Promise<PostDocument> {
        return this.postModel.findById(nftToken.post);
    }

    // @ResolveField(() => Listing)
    // async listing(@Parent() token): Promise<NftDocument> {
    //     console.log(token, 'token');

    //     // return this.listingService.findById(notification?.receiver);
    // }

    @Mutation(() => Nft)
    createNft(@Args('createNftInput') createNftInput: CreateNftInput) {
        return this.nftsService.create(createNftInput);
    }

    @Query(() => TokensResponse, { name: 'tokens', nullable: true })
    // @UseInterceptors(GraphqlCacheInterceptor)
    async tokens(
        @Args('query', { type: () => TokenFilterInput, nullable: true })
        query: TokenFilterInput,
        @Args('limit', { type: () => Int, defaultValue: 10, nullable: true })
        limit: number,
        @Args('cursor', { type: () => String, nullable: true }) cursor?: string
    ): Promise<TokensResponse> {
        return this.nftsService.findAll(query, limit, cursor);
    }

    @Query(() => Nft, { name: 'token' })
    findOne(
        @Args('contract', { type: () => String }) contract: string,
        @Args('chain', { type: () => String }) chain: string,
        @Args('tokenId', { type: () => String }) tokenId: string
    ) {
        return this.nftsService.findOne(contract, chain, tokenId);
    }

    @Query(() => Nft, { name: 'getToken', nullable: true })
    getToken(
        @Args('contract', { type: () => String }) contract: string,
        @Args('chain', { type: () => String, defaultValue: 'ethereum' })
        chain: string,
        @Args('tokenId', { type: () => String }) tokenId: string
    ) {
        return this.nftsService.getToken(contract, chain, tokenId);
    }

    @Mutation(() => Nft)
    updateNft(@Args('updateNftInput') updateNftInput: UpdateNftInput) {
        return this.nftsService.update(updateNftInput.id, updateNftInput);
    }

    @Mutation(() => Nft)
    removeNft(@Args('id', { type: () => Int }) id: number) {
        return this.nftsService.remove(id);
    }

    @Mutation(() => Boolean, { name: 'hideToken' })
    hideToken(
        @Args('data', { type: () => HiddenTokensInput }) data: HiddenTokensInput
    ) {
        return this.nftsService.hideToken(data);
    }

    @Query(() => [HiddenTokens], { name: 'hiddenTokens' })
    hiddenTokens(@Args('userId', { type: () => String }) userId: string) {
        return this.nftsService.hiddenTokens(userId);
    }

    @Query(() => [Nft], { name: 'getUserTokens', nullable: true })
    async getUserTokens(@Args('userId') userId: string): Promise<Nft[]> {
        return this.nftsService.getUserTokens(userId);
    }

    @Query(() => [Post], { name: 'getMostViewedNfts', nullable: true })
    async mostViewedCollections() {
        return this.nftsService.getMostViewed();
    }

    @Query(() => TokensCountsByStatus, {
        name: 'tokenCountsByStatus'
    })
    async countByStatus(
        @Args('contract', { type: () => String }) contract: string,
        @Args('chain', { type: () => String, defaultValue: 'ethereum' })
        chain: string
    ): Promise<TokensCountsByStatus> {
        return this.nftsService.countByStatus(contract, chain);
    }

    @Query(() => UserStats, {
        name: 'userStats'
    })
    async userStats(
        @Args('userId', { type: () => String }) userId: string
    ): Promise<UserStats> {
        return this.nftsService.userStats(new Types.ObjectId(userId));
    }

    @Query(() => LinkPreview, { name: 'nftLinkPreview', nullable: true })
    nftLinkPreview(
        @Args('contract', { type: () => String }) contract: string,
        @Args('chain', { type: () => String }) chain: string,
        @Args('tokenId', { type: () => String }) tokenId: string
    ) {
        return this.nftsService.getLinkPreview(contract, chain, tokenId);
    }
}
