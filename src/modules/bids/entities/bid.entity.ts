import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Price } from 'src/modules/reservoir/dto/reservoir.objecttypes';

@ObjectType()
class BidTokenData {
    @Field({ nullable: true })
    @Prop()
    tokenId: string;

    @Field({ nullable: true })
    @Prop()
    name: string;

    @Field({ nullable: true })
    @Prop()
    image: string;
}
@ObjectType()
class BidFeeBreakdown {
    @Field({ nullable: true })
    @Prop()
    bps: number;

    @Field({ nullable: true })
    @Prop()
    kind: string;

    @Field({ nullable: true })
    @Prop()
    recipient: string;
}

@ObjectType()
class BidCollectionData {
    @Field({ nullable: true })
    @Prop()
    id: string;

    @Field({ nullable: true })
    @Prop()
    name: string;

    @Field({ nullable: true })
    @Prop()
    image: string;
}
@ObjectType()
class BidAttributeData {
    @Field({ nullable: true })
    @Prop()
    key: string;
    @Field({ nullable: true })
    @Prop()
    value: string;
}

@ObjectType()
class BidCriteriaData {
    @Field(() => BidTokenData, { nullable: true })
    @Prop()
    token: BidTokenData;

    @Field(() => BidCollectionData, { nullable: true })
    @Prop()
    collection: BidCollectionData;

    @Field(() => BidAttributeData, { nullable: true })
    @Prop()
    attribute: BidAttributeData;
}

@ObjectType()
class BidCriteria {
    @Field()
    @Prop()
    kind: string;

    @Field(() => BidCriteriaData, { nullable: true })
    @Prop()
    data: BidCriteriaData;
}

@ObjectType()
class BidSource {
    @Field({ nullable: true })
    @Prop()
    id: string;

    @Field({ nullable: true })
    @Prop()
    domain: string;

    @Field({ nullable: true })
    @Prop()
    name: string;

    @Field({ nullable: true })
    @Prop()
    icon: string;

    @Field({ nullable: true })
    @Prop()
    url: string;
}

export type BidDocument = Bid & Document;
@Schema({ timestamps: true })
@ObjectType()
export class Bid {
    @Field(() => String, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    chain: string;

    @Field(() => String, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    currency: string;

    @Field(() => Int, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    chainId: number;

    @Field(() => Price, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    price: Price;

    @Field(() => String, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    id: string;

    @Field(() => String, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    kind: string;

    @Field(() => String, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    side: string;

    @Field(() => String, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    status: string;

    @Field(() => String, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    'tokenSetId': string;

    @Field(() => String, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    'tokenSetSchemaHash': string;

    @Field(() => String, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    contract: string;

    @Field(() => String, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    'maker': string;

    @Field(() => String, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    'taker': string;

    @Field(() => Float, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    'validFrom': number;

    @Field(() => Float, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    'validUntil': number;

    @Field(() => Int, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    'quantityFilled': number;

    @Field(() => Int, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    'quantityRemaining': number;

    @Field(() => Int, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    'dynamicPricing': number;

    @Field(() => BidCriteria, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    'criteria': BidCriteria;

    @Field(() => BidSource)
    @Prop()
    source: BidSource;

    @Field(() => Int, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    'feeBps': number;

    @Field(() => [BidFeeBreakdown], {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    'BidfeeBreakdown': BidFeeBreakdown[];

    @Field(() => Int, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    'expiration': number;
    //     "isReservoir": null,
    //     "isDynamic": false,
    //     "createdAt": "2023-07-10T05:51:42.958Z",
    //     "updatedAt": "2023-07-10T05:51:42.958Z",
    //     "originatedAt": "2023-07-10T05:51:38.799Z"
}

export const BidSchema = SchemaFactory.createForClass(Bid);

// BidSchema.index({
//     'criteria.kind': 1,
//     status: 1,
//     side: 1,
//     chain: 1,
//     contract: 1,
//     'price.amount.decimal': -1
// });

// BidSchema.index({
//     tokenId: 1,
//     contract: 1
// });

BidSchema.index(
    { 'market.price.amount.decimal': 1, contract: 1 },
    { storageEngine: { wiredTiger: { configString: 'block_compressor=zlib' } } }
);
BidSchema.index(
    { 'criteria.data.token.tokenId': 1, contract: 1 },
    { storageEngine: { wiredTiger: { configString: 'block_compressor=zlib' } } }
);
BidSchema.index({ createdAt: 1 }); // Sort by createdAt in ascending order
BidSchema.index({ 'price.amount.decimal': 1 }); // Sort by price.amount.decimal in ascending order
BidSchema.index({ 'market.price.amount.decimal': 1 }); // Sort by price.amount.decimal in ascending order
BidSchema.index({ contract: 1 }); // Index on the contract field for frequent queries
BidSchema.index({ tokenId: 1, contract: 1 }); // Index on the contract field for frequent queries
BidSchema.index(
    { expiration: 1, status: 1, 'source.domain': 1 },
    { storageEngine: { wiredTiger: { configString: 'block_compressor=zlib' } } }
);
BidSchema.index({ maker: 1, taker: 1 });
