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
