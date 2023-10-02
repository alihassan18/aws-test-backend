// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
// import { Document } from 'mongoose';

// @ObjectType()
// class Trade {
//     @Field(() => String)
//     @Prop()
//     transaction_hash: string;

//     @Field(() => Int)
//     @Prop()
//     timestamp: number;

//     @Field(() => String)
//     @Prop()
//     exchange_name: string;

//     @Field(() => Float)
//     @Prop()
//     trade_price: number;
// }

// @ObjectType()
// class AmountDistributionItem {
//     @Field(() => String)
//     @Prop()
//     name: string;

//     @Field(() => Int)
//     @Prop()
//     value: number;

//     @Field(() => String)
//     @Prop()
//     proportion: string;
// }

// @ObjectType()
// class AmountDistribution {
//     @Field(() => Float)
//     @Prop()
//     total: number;

//     @Field(() => [AmountDistributionItem])
//     @Prop()
//     distribution: AmountDistributionItem[];
// }

// export type TradeDistributionDocument = TradeDistribution & Document;

// @ObjectType()
// @Schema()
// export class TradeDistribution extends Document {
//     @Field()
//     @Prop({ unique: true })
//     contract: string;

//     @Field(() => [Trade])
//     @Prop()
//     trade: Trade[];

//     @Field(() => AmountDistribution)
//     @Prop()
//     amount: AmountDistribution;

//     @Field(() => AmountDistribution)
//     @Prop()
//     period: AmountDistribution;
// }

// export const TradeDistributionSchema =
//     SchemaFactory.createForClass(TradeDistribution);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Document } from 'mongoose';

export type TradeDistributionDocument = TradeDistribution & Document;

@ObjectType()
@Schema()
export class TradeDistribution extends Document {
    @Field()
    @Prop()
    contract: string;

    @Field(() => String)
    @Prop()
    transaction_hash: string;

    @Field(() => Int)
    @Prop()
    timestamp: number;

    @Field(() => String)
    @Prop()
    exchange_name: string;

    @Field(() => Float)
    @Prop()
    trade_price: number;
}

export const TradeDistributionSchema =
    SchemaFactory.createForClass(TradeDistribution);
TradeDistributionSchema.index(
    { contract: 1, transaction_hash: 1 },
    { unique: true }
);
