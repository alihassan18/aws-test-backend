import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Document } from 'mongoose';

@ObjectType()
class AmountDistributionItem {
    @Field(() => String)
    @Prop()
    name: string;

    @Field(() => Int)
    @Prop()
    value: number;

    @Field(() => String)
    @Prop()
    proportion: string;
}

@ObjectType()
class AmountDistribution {
    @Field(() => Float)
    @Prop()
    total: number;

    @Field(() => [AmountDistributionItem])
    @Prop()
    distribution: AmountDistributionItem[];
}

export type DistributionsDocument = Distributions & Document;

@ObjectType()
@Schema()
export class Distributions extends Document {
    @Field()
    @Prop({ unique: true })
    contract: string;

    @Field(() => AmountDistribution)
    @Prop()
    amount: AmountDistribution;

    @Field(() => AmountDistribution)
    @Prop()
    period: AmountDistribution;
}

export const DistributionSchema = SchemaFactory.createForClass(Distributions);
