import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Message } from './message.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Chat extends Document {
    @Field(() => String)
    _id: string;

    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user1: Types.ObjectId;

    @Field(() => User, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user2: Types.ObjectId;

    @Field(() => Number, { nullable: true })
    @Prop({
        type: Number,
        default: 0
    })
    unseenMsgCount: number;

    @Field(() => Message, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'Message' })
    lastMessage: Types.ObjectId;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}

@ObjectType()
export class Emotion {
    @Field(() => String)
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: string;

    @Field(() => String, { nullable: true })
    emoji: string;

    @Field(() => String, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'Message' })
    messageId: Types.ObjectId;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
