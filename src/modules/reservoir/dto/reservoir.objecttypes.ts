import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class Currency {
    @Field({ nullable: true })
    contract: string;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    symbol: string;

    @Field({ nullable: true })
    decimals: number;
}

@ObjectType()
export class Amount {
    @Field({ nullable: true })
    raw: string;

    @Field({ nullable: true })
    decimal: number;

    @Field({ nullable: true })
    usd: number;

    @Field({ nullable: true })
    native: number;
}

@ObjectType()
export class FloorAskPrice {
    @Field(() => Currency)
    'currency': Currency;

    @Field(() => Amount)
    'amount': Amount;
}

@ObjectType()
export class ReservoirSearchedCollection {
    @Field({ nullable: true })
    collectionId: string;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    slug: string;

    @Field({ nullable: true })
    contract: string;

    @Field({ nullable: true })
    image: string;

    @Field({ nullable: true })
    allTimeVolume: number;

    @Field(() => FloorAskPrice, { nullable: true })
    floorAskPrice: FloorAskPrice;

    @Field({ nullable: true })
    openseaVerificationStatus: string;

    @Field({ nullable: true })
    chainName: string;

    @Field({ nullable: true })
    chainId: number;

    @Field({ nullable: true })
    lightChainIcon: string;

    @Field({ nullable: true })
    darkChainIcon: string;
}

@ObjectType()
class RoyaltyBreakdown {
    @Field(() => Int)
    bps: number;

    @Field({ nullable: true })
    recipient: string;
}

@ObjectType()
class Royalties {
    @Field({ nullable: true })
    recipient: string;

    @Field(() => Int)
    bps: number;

    @Field(() => [RoyaltyBreakdown])
    breakdown: RoyaltyBreakdown[];
}

@ObjectType()
export class Price {
    @Field(() => Currency)
    currency: Currency;

    @Field(() => Amount)
    amount: Amount;

    @Field(() => Amount, { nullable: true })
    netAmount?: Amount;
}

@ObjectType()
class ReservoirToken {
    @Field({ nullable: true })
    contract: string;

    @Field({ nullable: true })
    tokenId: string;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    image: string;
}

@ObjectType()
class FloorAsk {
    @Field({ nullable: true })
    id: string;

    @Field({ nullable: true })
    sourceDomain: string;

    @Field(() => Price)
    price: Price;

    @Field({ nullable: true })
    maker: string;

    @Field(() => Int)
    validFrom: number;

    @Field(() => Int)
    validUntil: number;

    @Field(() => ReservoirToken)
    token: ReservoirToken;
}
@ObjectType()
class VolumeChange {
    @Field(() => Int, { nullable: true })
    _1day: number;

    @Field(() => Int, { nullable: true })
    _7day: number;

    @Field(() => Int, { nullable: true })
    _30day: number;
}

@ObjectType()
class Rank {
    @Field(() => Int)
    _1day: number;

    @Field(() => Int)
    _7day: number;

    @Field(() => Int, { nullable: true })
    _30day: number;

    @Field(() => Int)
    allTime: number;
}

@ObjectType()
class Volume {
    @Field(() => Float)
    _1day: number;

    @Field(() => Float)
    _7day: number;

    @Field(() => Float, { nullable: true })
    _30day: number;

    @Field(() => Float)
    allTime: number;
}

@ObjectType()
export class ReservoirCollection {
    @Field({ nullable: true })
    id: string;

    @Field({ nullable: true })
    slug: string;

    @Field({ nullable: true })
    createdAt: string;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    image: string;

    @Field({ nullable: true })
    banner: string;

    @Field({ nullable: true })
    discordUrl: string;

    @Field({ nullable: true })
    externalUrl: string;

    @Field({ nullable: true })
    twitterUsername: string;

    @Field({ nullable: true })
    openseaVerificationStatus: string;

    @Field({ nullable: true })
    description: string;

    @Field(() => [String])
    sampleImages: string[];

    @Field({ nullable: true })
    tokenCount: string;

    @Field({ nullable: true })
    onSaleCount: string;

    @Field({ nullable: true })
    primaryContract: string;

    @Field({ nullable: true })
    tokenSetId: string;

    @Field(() => Royalties)
    royalties: Royalties;

    // @Field({ nullable: true })
    // lastBuy: string;

    @Field(() => FloorAsk)
    floorAsk: FloorAsk;

    @Field(() => Rank)
    rank: Rank;

    @Field(() => Volume)
    volume: Volume;

    @Field({ nullable: true })
    volumeChange: VolumeChange;

    @Field({ nullable: true })
    floorSale: VolumeChange;

    @Field({ nullable: true })
    floorSaleChange: VolumeChange;

    @Field({ nullable: true })
    collectionBidSupported: boolean;

    @Field(() => Int)
    ownerCount: number;

    @Field({ nullable: true })
    contractKind: string;

    @Field({ nullable: true })
    mintedTimestamp: string;

    @Field(() => [String])
    mintStages: string[];
}

@ObjectType()
export class ReservoirCollectionResults {
    @Field(() => [ReservoirCollection])
    collections: [ReservoirCollection];

    @Field(() => String, { nullable: true })
    continuation: string;
}
