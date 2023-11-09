import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Schema()
export class WithdrawRequest {
    // @Field(() => ID)
    // id: mongoose.Schema.Types.ObjectId;

    @Field(() => ID)
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: mongoose.Schema.Types.ObjectId;

    @Field()
    @Prop()
    amount: number;

    @Field()
    @Prop({ default: 'pending' })
    status: string;

    @Field(() => Boolean)
    @Prop({ default: false })
    processed: boolean;
}

export const WithdrawRequestSchema =
    SchemaFactory.createForClass(WithdrawRequest);
