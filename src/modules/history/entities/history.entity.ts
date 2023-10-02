import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Price } from 'src/modules/reservoir/dto/reservoir.objecttypes';

@ObjectType()
export class HistoryToken {
    @Field({ nullable: true })
    tokenId: string;

    @Field({ nullable: true })
    tokenName: string;

    @Field({ nullable: true })
    tokenImage: string;
}

@ObjectType()
export class HistoryCollection {
    @Field({ nullable: true })
    collectionId: string;

    @Field({ nullable: true })
    collectionName: string;

    @Field({ nullable: true })
    collectionImage: string;
}

@ObjectType()
export class HistorySource {
    @Field({ nullable: true })
    domain: string;

    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    icon: string;
}

@ObjectType()
export class HistoryCriteria {
    @Field({ nullable: true })
    kind: string;

    @Field(() => HistoryToken, { nullable: true })
    token: HistoryToken;

    @Field(() => HistoryCollection, { nullable: true })
    collection: HistoryCollection;
}

@ObjectType()
export class HistoryOrder {
    @Field({ nullable: true })
    id: string;

    @Field({ nullable: true })
    side: string;

    @Field(() => HistorySource, { nullable: true })
    source: HistorySource;

    @Field(() => HistoryCriteria, { nullable: true })
    criteria: HistoryCriteria;
}

export type HistoryDocument = History & Document;
@Schema({ timestamps: true })
@ObjectType()
export class History {
    @Field(() => String, { nullable: true })
    @Prop()
    type: string;

    @Field(() => String, { nullable: true })
    @Prop()
    fromAddress: string;

    @Field({ nullable: true })
    @Prop()
    toAddress: string;

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
    createdAt: string;

    @Field({ nullable: true })
    @Prop()
    contract: string;

    @Field(() => HistoryToken, { nullable: true })
    @Prop()
    token: HistoryToken;

    @Field(() => HistoryCollection, { nullable: true })
    @Prop()
    _collection: HistoryCollection;

    @Field({ nullable: true })
    @Prop()
    txHash: string;

    @Field({ nullable: true })
    @Prop()
    logIndex: number;

    @Field({ nullable: true })
    @Prop()
    batchIndex: number;

    @Field(() => HistoryOrder, { nullable: true })
    @Prop()
    order: HistoryOrder;
}

export const HistorySchema = SchemaFactory.createForClass(History);
