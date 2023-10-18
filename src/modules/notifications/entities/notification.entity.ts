import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Collection } from 'src/modules/collections/entities/collection.entity';
import { ENotificationFromType, NotificationType } from '../notifications.enum';
import { COLLECTIONS, POSTS, USERS } from 'src/constants/db.collections';
import { Post } from 'src/modules/feeds/entities/post.entity';
import { ActTokenData } from 'src/modules/activities/entities/activities.entity';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
@ObjectType()
export class Notification extends Document {
    @Field()
    _id: string;

    @Field(() => String)
    @Prop({ required: true, enum: NotificationType })
    type: string;

    @Field(() => String)
    @Prop({ required: true, enum: ENotificationFromType })
    sender: string;

    @Field(() => String, { nullable: true })
    @Prop()
    message: string;

    @Field(() => Boolean, { nullable: true })
    @Prop({ default: false })
    seen: boolean;

    @Field(() => User, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: USERS, required: false }) // passing false and nullable true for the sake of development
    receiver: Types.ObjectId;

    @Field(() => User, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: USERS })
    from: Types.ObjectId;

    @Field(() => Collection, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: COLLECTIONS })
    _collection: Types.ObjectId;

    @Field(() => ActTokenData, { nullable: true })
    @Prop({ type: ActTokenData })
    nft: ActTokenData;

    @Field(() => Post, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: POSTS })
    post: Types.ObjectId;

    @Field(() => String, { nullable: true })
    @Prop({ type: String })
    stage: string;

    @Field(() => Date, { nullable: true })
    createdAt: string;

    @Field(() => Date, { nullable: true })
    updatedAt: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
