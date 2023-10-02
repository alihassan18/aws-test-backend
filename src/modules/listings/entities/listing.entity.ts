import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { ObjectId, Schema as MongoSchema } from 'mongoose';
// import { Nft } from 'src/modules/nfts/entities/nft.entity';
import { Price } from 'src/modules/reservoir/dto/reservoir.objecttypes';

@ObjectType()
class TokenData {
    @Field({ nullable: true })
    @Prop()
    tokenId: string;
}

@ObjectType()
class CriteriaData {
    @Field(() => TokenData, { nullable: true })
    @Prop()
    token: TokenData;
}

@ObjectType()
class Criteria {
    @Field()
    @Prop()
    kind: string;

    @Field(() => CriteriaData, { nullable: true })
    @Prop()
    data: CriteriaData;
}

@ObjectType()
class Source {
    @Field()
    @Prop()
    id: string;

    @Field()
    @Prop()
    domain: string;

    @Field()
    @Prop()
    name: string;

    @Field()
    @Prop()
    icon: string;

    @Field()
    @Prop()
    url: string;
}
@ObjectType()
class FeeBreakdown {
    @Field()
    @Prop()
    recipient: string;

    @Field()
    @Prop()
    name: string;

    @Field()
    @Prop()
    kind: string;

    @Field()
    @Prop()
    bps: number;
}

export type ListingDocument = Listing & Document;
@Schema({ timestamps: true })
@ObjectType()
export class Listing {
    // @Field(() => String, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // listingId: number;

    // @Field(() => String, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // name: string;

    // @Field(() => Nft, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop({ type: MongoSchema.Types.ObjectId, ref: Nft.name })
    // nft: ObjectId;

    // @Field(() => String, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // blockHash: string;

    // @Field(() => Int, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // blockNumber: number;

    // @Field(() => String, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // transactionHash: string;

    // @Field(() => Int, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // transactionIndex: number;

    // @Field(() => String, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // from: string;

    // @Field(() => String, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // to: string;

    // @Field(() => Int, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // logIndex: number;

    // @Field(() => String, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // sender: string;

    // @Field(() => String, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // hostContract: string;

    // @Field(() => String, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // tokenId: string;

    // @Field(() => String, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // copyIndex: string;

    // @Field(() => String, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // sellMode: string;

    // @Field(() => String, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // startTime: string;

    // @Field(() => String, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // duration: string;

    // @Field(() => Boolean, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // isActive: boolean;

    // @Field(() => Boolean, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // isBlocked: boolean;

    // @Field(() => Boolean, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // isFeatured: boolean;

    // @Field(() => Date, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // endTime: Date;

    // @Field(() => String, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // soldTo: string;

    // @Field(() => String, {
    //     description: 'Example field (placeholder)',
    //     nullable: true
    // })
    // @Prop()
    // alertText: string;

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
    @Prop({ unique: true })
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

    @Field(() => Criteria, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    'criteria': Criteria;

    @Field(() => Source)
    @Prop()
    source: Source;

    @Field(() => Int, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    'feeBps': number;

    @Field(() => [FeeBreakdown], {
        description: 'Example field (placeholder)',
        nullable: true
    })
    @Prop()
    'feeBreakdown': FeeBreakdown[];

    @Field(() => Float, {
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

export const ListingSchema = SchemaFactory.createForClass(Listing);
ListingSchema.index(
    { 'market.price.amount.decimal': 1, contract: 1 },
    { storageEngine: { wiredTiger: { configString: 'block_compressor=zlib' } } }
);
ListingSchema.index(
    { 'criteria.data.token.tokenId': 1, contract: 1 },
    { storageEngine: { wiredTiger: { configString: 'block_compressor=zlib' } } }
);
ListingSchema.index({ createdAt: 1 }); // Sort by createdAt in ascending order
ListingSchema.index({ 'price.amount.decimal': 1 }); // Sort by price.amount.decimal in ascending order
ListingSchema.index({ 'market.price.amount.decimal': 1 }); // Sort by price.amount.decimal in ascending order
ListingSchema.index({ contract: 1 }); // Index on the contract field for frequent queries
ListingSchema.index({ tokenId: 1, contract: 1 }); // Index on the contract field for frequent queries
ListingSchema.index(
    { expiration: 1, status: 1, 'source.domain': 1 },
    { storageEngine: { wiredTiger: { configString: 'block_compressor=zlib' } } }
);
ListingSchema.index({ maker: 1, taker: 1 });
ListingSchema.index({ validUntil: 1 });
