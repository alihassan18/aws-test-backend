import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date } from 'mongoose';
import { Price } from 'src/modules/reservoir/dto/reservoir.objecttypes';

@ObjectType()
export class SalesCollection {
    @Field({ nullable: true })
    id: string;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    image: string;
}

@ObjectType()
export class SalesToken {
    @Field({ nullable: true })
    tokenId: string;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    image: string;

    @Field({ nullable: true })
    contract: string;

    @Field(() => SalesCollection, { nullable: true })
    @Prop({ name: '_collection' })
    collection: SalesCollection;
}

@ObjectType()
export class SalesSource {
    @Field({ nullable: true })
    domain: string;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    icon: string;
}

@ObjectType()
export class SalesCriteria {
    @Field({ nullable: true })
    kind: string;

    @Field(() => SalesToken, { nullable: true })
    token: SalesToken;

    @Field(() => SalesCollection, { nullable: true })
    collection: SalesCollection;
}

@ObjectType()
export class SalesOrder {
    @Field({ nullable: true })
    id: string;

    @Field({ nullable: true })
    side: string;

    @Field(() => SalesSource, { nullable: true })
    source: SalesSource;

    @Field(() => SalesCriteria, { nullable: true })
    criteria: SalesCriteria;
}

export type SalesDocument = Sales & Document;
@Schema({ timestamps: true })
@ObjectType()
export class Sales {
    @Field(() => String, { nullable: true })
    _id: string;

    @Field(() => String, { nullable: true })
    @Prop({ unique: true })
    id: string;

    @Field(() => String, { nullable: true })
    @Prop()
    type: string;

    @Field(() => String, { nullable: true })
    @Prop()
    from: string;

    @Field({ nullable: true })
    @Prop()
    to: string;

    @Field(() => Price, { nullable: true })
    @Prop()
    price: Price;

    @Field({ nullable: true })
    @Prop()
    amount: number;

    @Field({ nullable: true })
    @Prop()
    timestamp: number;

    @Field({ nullable: true })
    @Prop()
    createdAt: Date;

    @Field({ nullable: true })
    @Prop()
    updatedAt: Date;

    @Field({ nullable: true })
    @Prop()
    contract: string;

    @Field(() => SalesToken, { nullable: true })
    @Prop()
    token: SalesToken;

    @Field(() => SalesCollection, { nullable: true })
    @Prop()
    _collection: SalesCollection;

    @Field({ nullable: true })
    @Prop()
    txHash: string;

    @Field({ nullable: true })
    @Prop()
    logIndex: number;

    @Field({ nullable: true })
    @Prop()
    batchIndex: number;

    @Field(() => SalesOrder, { nullable: true })
    @Prop()
    order: SalesOrder;
}

export const SalesSchema = SchemaFactory.createForClass(Sales);
