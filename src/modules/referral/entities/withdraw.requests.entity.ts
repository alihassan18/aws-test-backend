import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
@Schema()
export class WithdrawRequest {
    @Field(() => String)
    _id: mongoose.Schema.Types.ObjectId;

    @Field(() => User)
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: mongoose.Schema.Types.ObjectId;

    @Field({ nullable: true })
    @Prop()
    address: string;

    @Field({ nullable: true })
    @Prop()
    amount: number;

    @Field({ nullable: true })
    @Prop({ default: 'pending' })
    status: string;

    @Field(() => Boolean, { nullable: true })
    @Prop({ default: false })
    processed: boolean;
}

export const WithdrawRequestSchema =
    SchemaFactory.createForClass(WithdrawRequest);
