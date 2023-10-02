import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Group } from 'src/modules/chat/entities/group.entity';
import { Chat } from './chat.entity';

@ObjectType()
@Schema({ timestamps: true })
export class ChatNotification extends Document {
    @Field(() => String)
    _id: string;

    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    sender: Types.ObjectId;

    @Field(() => Chat)
    @Prop({ type: Types.ObjectId, ref: 'Chat' })
    chatId: Types.ObjectId;

    @Field(() => Group)
    @Prop({ type: Types.ObjectId, ref: 'Group' })
    groupId: Types.ObjectId;

    @Field(() => String)
    @Prop()
    type: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}

export const ChatNotificationSchema =
    SchemaFactory.createForClass(ChatNotification);
