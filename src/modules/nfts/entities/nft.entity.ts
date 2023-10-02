import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Post } from 'src/modules/feeds/entities/post.entity';
import { Listing } from 'src/modules/listings/entities/listing.entity';
@ObjectType()
class Metadata {
    @Field({ nullable: true })
    @Prop()
    imageOriginal: string;
}

@ObjectType()
class Breakdown {
    @Field({ nullable: true })
    @Prop()
    bps: number;

    @Field({ nullable: true })
    @Prop()
    recipient: string;
}
@ObjectType()
class Royality {
    @Field({ nullable: true })
    @Prop()
    recipient: string;

    @Field(() => [Breakdown], { nullable: true })
    @Prop()
    breakdown: Breakdown[];

    @Field({ nullable: true })
    @Prop()
    bps: number;
}

@ObjectType()
class AAttribute {
    @Field({ nullable: true })
    @Prop()
    imageOriginal: string;

    @Field(() => String, { nullable: true })
    @Prop()
    'key': string;
    @Field(() => String, { nullable: true })
    @Prop()
    'kind': string;
    @Field(() => String, { nullable: true })
    @Prop()
    'value': string;
    @Field(() => Int, { nullable: true })
    @Prop()
    'tokenCount': number;
    @Field(() => Int, { nullable: true })
    @Prop()
    'onSaleCount': number;
    @Field(() => Float, { nullable: true })
    @Prop()
    'floorAskPrice': number;
    @Field(() => Float, { nullable: true })
    @Prop()
    'topBidValue': number;
    @Field({ nullable: true })
    @Prop()
    'createdAt': string;
}
export type NftDocument = Nft & Document;
@Schema({ timestamps: true })
@ObjectType()
class TokenCollection {
    @Field({ nullable: true })
    @Prop()
    id: string;

    @Field({ nullable: true })
    @Prop()
    name: string;

    @Field({ nullable: true })
    @Prop()
    image: string;

    @Field({ nullable: true })
    @Prop()
    slug: string;

    @Field({ nullable: true })
    @Prop()
    chain: string;

    @Field({ nullable: true })
    @Prop()
    contract: string;

    @Field({ nullable: true })
    @Prop()
    contract_name: string;

    @Field(() => Float, { nullable: true })
    @Prop()
    owns_total: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    items_total: number;

    @Field({ nullable: true })
    @Prop()
    symbol: string;

    @Field({ nullable: true })
    @Prop()
    description: string;

    @Field(() => Float, { nullable: true })
    @Prop()
    floor_price: number;

    @Field(() => Boolean, { nullable: true })
    @Prop()
    verified: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop()
    opensea_verified: boolean;
}

@Schema({ timestamps: true })
@ObjectType()
export class Nft {
    @Field()
    _id: string;

    @Field({ nullable: true })
    @Prop()
    contract: string;

    @Field({ defaultValue: 'ethereum' })
    @Prop({ default: 'ethereum' })
    chain: string;

    @Field({ nullable: true })
    @Prop()
    tokenId: string;

    @Field({ nullable: true })
    @Prop()
    name: string;

    @Field({ nullable: true })
    @Prop()
    description: string;

    @Field({ nullable: true })
    @Prop()
    image: string;

    @Field({ nullable: true })
    @Prop()
    imageSmall: string;

    @Field({ nullable: true })
    @Prop()
    imageLarge: string;

    @Field(() => Metadata, { nullable: true })
    @Prop()
    metadata: Metadata;

    @Field({ nullable: true })
    @Prop()
    media: string;

    @Field({ nullable: true })
    @Prop()
    kind: string;

    @Field({ nullable: true })
    @Prop()
    isFlagged: boolean;

    @Field({ nullable: true })
    @Prop()
    lastFlagUpdate: Date;

    @Field({ nullable: true })
    @Prop()
    lastFlagChange: string;

    @Field({ nullable: true })
    @Prop()
    supply: string;

    @Field({ nullable: true })
    @Prop()
    remainingSupply: string;

    @Field({ nullable: true })
    @Prop()
    rarity: number;

    @Field({ nullable: true })
    @Prop()
    rarityRank: number;

    @Field(() => TokenCollection, { nullable: true })
    @Prop()
    _collection: TokenCollection;

    @Field(() => TokenCollection, { nullable: true })
    collection: TokenCollection;

    @Field({ nullable: true })
    @Prop()
    owner: string;

    @Field({ nullable: true })
    @Prop()
    contractAddress: string;

    @Field({ nullable: true })
    @Prop()
    contractName: string;

    @Field({ nullable: true })
    @Prop()
    contractTokenId: string;

    // @Field({nullable:true})
    // @Prop()
    // tokenId: string;

    @Field({ nullable: true })
    @Prop()
    ercType: string;

    @Field({ nullable: true })
    @Prop()
    amount: string;

    @Field({ nullable: true })
    @Prop()
    minter: string;

    @Field(() => Float, { defaultValue: 0 })
    @Prop({ default: 0 })
    views: number;

    @Field({ nullable: true })
    @Prop()
    ownTimestamp: number;

    @Field({ nullable: true })
    @Prop()
    mintTimestamp: number;

    @Field({ nullable: true })
    @Prop()
    mintTransactionHash: string;

    @Field(() => Float, { nullable: true })
    @Prop()
    mintPrice: number;

    @Field({ nullable: true })
    @Prop()
    tokenUri: string;

    @Field({ nullable: true })
    @Prop()
    metadataJson: string;

    // // Additional MongoDB properties
    // @Field({nullable:true})
    // @Prop()
    // name: string;

    @Field({ nullable: true })
    @Prop()
    contentType: string;

    @Field({ nullable: true })
    @Prop()
    contentUri: string;

    // @Field({nullable:true})
    // @Prop()
    // description: string;

    @Field({ nullable: true })
    @Prop()
    imageUri: string;

    @Field({ nullable: true })
    @Prop()
    externalLink: string;

    @Field(() => Float, { nullable: true })
    @Prop()
    latestTradePrice?: number;

    @Field({ nullable: true })
    @Prop()
    latestTradeSymbol?: string;

    @Field({ nullable: true })
    @Prop()
    latestTradeToken?: string;

    @Field({ nullable: true })
    @Prop()
    latestTradeTimestamp?: number;

    @Field({ nullable: true })
    @Prop()
    nftscanId: string;

    @Field({ nullable: true })
    @Prop()
    nftscanUri: string;

    @Field({ nullable: true })
    @Prop()
    smallNftscanUri: string;

    @Field(() => [AAttribute], { nullable: true })
    @Prop()
    attributes: AAttribute[];

    @Field(() => Float, { nullable: true })
    @Prop()
    rarityScore: number;

    @Field(() => Post, {
        nullable: true,
        description: 'Related post for a collection'
    })
    @Prop({ type: Types.ObjectId, ref: Post.name })
    post?: Types.ObjectId;

    @Field(() => Listing, { nullable: true })
    market: Listing;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean })
    is_deleted?: boolean;

    @Field(() => Royality, { nullable: true })
    @Prop()
    royalties: Royality;

    // @Field({nullable:true})
    // @Prop()
    // rarityRank: number;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean })
    onMintstartgram: boolean;
}

export const NftSchema = SchemaFactory.createForClass(Nft);
NftSchema.index({ contract: 1, chain: 1, tokenId: 1 }, { unique: true });
NftSchema.index({ contract: 1, chain: 1 });
NftSchema.index({ createdAt: 1 }); // Sort by createdAt in ascending order
NftSchema.index({ tokenId: 1 }); // Index on tokenId for frequent queries
NftSchema.index({ contract: 1 });
NftSchema.index({ name: 'text' });
NftSchema.index({ owner: 1, mintTimestamp: -1 });
