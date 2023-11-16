import { InputType, Int, Field, ObjectType, Float } from '@nestjs/graphql';
import { Collection } from '../entities/collection.entity';
import { PageInfo } from 'src/modules/feeds/dto/create-feed.input';

@InputType()
export class CreateCollectionInput {
    @Field(() => String, { description: 'Name field (placeholder)' })
    name: string;

    @Field(() => String, {
        description: 'Name field (placeholder)',
        nullable: true
    })
    description: string;

    @Field(() => String, {
        description: 'Name field (placeholder)',
        nullable: true
    })
    image: string;

    @Field(() => String, {
        description: 'Name field (placeholder)',
        nullable: true
    })
    banner: string;

    @Field(() => String, {
        description: 'Contract address field (placeholder)'
    })
    contract: string;

    @Field(() => Int, {
        description: 'Contract address field (placeholder)',
        nullable: true
    })
    deploy_block_number: number;

    @Field(() => String, { description: 'Chain name field (placeholder)' })
    chain: string;

    @Field(() => Int, { description: 'Chain id field (placeholder)' })
    chainId: number;

    @Field(() => Boolean, { nullable: true })
    is_content_creator: boolean;

    @Field(() => Boolean, { nullable: true })
    is_auto_auction: boolean;

    @Field(() => Boolean, { nullable: true })
    is_auto_mint: boolean;

    @Field(() => Int, { nullable: true })
    listing_price: number;

    @Field(() => Int, {
        nullable: true,
        description: 'Action duration in the unix timestamps'
    })
    auction_duration: number;

    @Field(() => Int, {
        nullable: true,
        description: 'Total supply field (placeholder)'
    })
    supply: number;

    @Field(() => String, { description: 'symbol field (placeholder)' })
    symbol: string;

    @Field(() => String, { nullable: true })
    website: string;

    @Field(() => String, { nullable: true })
    linkedin: string;

    @Field(() => String, { nullable: true })
    twitter?: string;

    @Field(() => String, { nullable: true })
    facebook?: string;

    @Field(() => String, { nullable: true })
    twitch?: string;

    @Field(() => String, { nullable: true })
    tiktok?: string;

    @Field(() => String, { nullable: true })
    youtube?: string;

    @Field(() => String, { nullable: true })
    discord?: string;

    @Field(() => String, { nullable: true })
    telegram?: string;

    @Field(() => String, { nullable: true })
    web?: string;

    @Field(() => String, { nullable: true })
    github?: string;

    @Field(() => String, { nullable: true })
    instagram?: string;

    @Field(() => String, { nullable: true, defaultValue: 'ERC721' })
    erc_type: string;

    @Field(() => String, { nullable: true })
    deployer_address: string;

    @Field(() => String, { nullable: true })
    owner: string;

    @Field(() => Int, { nullable: true })
    royalty: number;

    @Field(() => String, {
        description: 'Chain name field (placeholder)',
        nullable: true
    })
    listing_type: string;
}

@InputType()
export class CollectionSortInput {
    @Field(() => String)
    type: string;

    @Field(() => Int)
    value: number;
}

@InputType()
export class CollectionFilterInput {
    @Field(() => [String], { nullable: true })
    chain?: string[];

    @Field(() => String, { nullable: true })
    keyword?: string;

    @Field(() => String, { nullable: true })
    creator?: string;

    @Field(() => [String], { nullable: true })
    creators?: string[];

    // @Field(() => String, { nullable: true })
    // deployer_address?: string;

    @Field(() => String, { nullable: true })
    owner?: string;

    @Field(() => String, { nullable: true })
    follower?: string;

    @Field(() => Boolean, { nullable: true })
    is_content_creator?: boolean;

    @Field(() => Boolean, { nullable: true })
    is_metaverse?: boolean;

    @Field(() => Boolean, { nullable: true })
    is_auto_auction?: boolean;

    @Field(() => Boolean, { nullable: true })
    is_minted?: boolean;

    @Field(() => CollectionSortInput, { nullable: true })
    sort?: CollectionSortInput;
}

@ObjectType()
export class CollectionResponse {
    @Field(() => [Collection])
    records: Collection[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
}

@InputType()
export class CreateCollectionTokenInput {
    @Field(() => String)
    tokenId: string;

    @Field(() => String)
    description: string;

    @Field(() => String)
    name: string;

    @Field(() => String)
    image: string;

    @Field(() => String)
    metadata_url: string;
}

@ObjectType()
export class CollectionSearchResults {
    @Field(() => String, { nullable: true })
    collectionId: string;

    @Field(() => String, { nullable: true })
    name: string;

    @Field(() => Int, { nullable: true })
    tokenCount: number;

    @Field(() => String, { nullable: true })
    image: string;

    @Field(() => String, { nullable: true })
    slug: string;

    @Field(() => String, { nullable: true })
    contract: string;

    @Field(() => Float, { nullable: true })
    allTimeVolume: number;

    @Field(() => String, { nullable: true })
    openseaVerificationStatus: string;

    @Field(() => String, { nullable: true })
    chainName: string;

    @Field(() => Int, { nullable: true })
    chainId: number;

    @Field(() => String, { nullable: true })
    lightChainIcon: string;

    @Field(() => String, { nullable: true })
    darkChainIcon: string;
}
