import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Group } from './group.entity';
import { Reactions } from 'src/modules/feeds/entities/post.entity';
import { Chat } from './chat.entity';

export type MessageDocument = Message & Document;
@ObjectType()
@Schema({ timestamps: true })
export class Message extends Document {
    @Field(() => String)
    _id: string;

    @Field(() => String)
    @Prop()
    content: string;

    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sender: Types.ObjectId;

    @Field(() => User, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'User' })
    receiverUser: Types.ObjectId;

    @Field(() => [User])
    @Prop([{ type: Types.ObjectId, ref: 'User' }])
    hiddenUsers: Types.ObjectId[];

    @Field(() => [String])
    @Prop([{ type: Types.ObjectId, ref: 'User' }])
    seenUsers: Types.ObjectId[];

    @Field(() => Group, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'Group' })
    receiverGroup: Types.ObjectId;

    @Field(() => Chat, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'Chat' })
    chatId: Types.ObjectId;

    @Field(() => String, { description: 'Example field (placeholder)' })
    @Prop({ required: true })
    type: string;

    @Field(() => [String], {
        description: 'Attachment field (placeholder)',
        nullable: true
    })
    @Prop()
    attachment: string[];

    @Field(() => Message, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'Message', default: null })
    inReplyToMessage: Types.ObjectId | null;

    @Field(() => Boolean, { defaultValue: false })
    @Prop({ default: false })
    sent: boolean;

    @Field(() => Boolean, { defaultValue: false })
    @Prop({ default: false })
    edited: boolean;

    @Field(() => Boolean, { defaultValue: false })
    @Prop()
    pinned: boolean;

    @Field(() => Boolean, { defaultValue: true, nullable: false })
    @Prop({ default: true })
    delivered: boolean;

    @Field(() => Boolean, { defaultValue: false })
    @Prop()
    read: boolean;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => [Reactions])
    @Prop()
    reactions: Reactions[];

    @Field(() => [Emotion])
    @Prop()
    emotions: Emotion[];
}

@ObjectType()
export class Emotion {
    @Field(() => User, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId;

    @Field(() => String, { nullable: true })
    emoji: string;

    @Field(() => String, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'Message' })
    messageId: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
