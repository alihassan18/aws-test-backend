import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Collection } from 'src/modules/collections/entities/collection.entity';
import { Post } from './post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { FeedTypes } from '../feeds.enums';
import { Hashtag } from './hashtag.entity';
import { USERS } from 'src/constants/db.collections';

// Register the enum for GraphQL
registerEnumType(FeedTypes, {
    name: 'FeedTypes'
});

export type FeedDocument = Feed & Document;
@Schema({ timestamps: true })
@ObjectType()
export class Feed extends Document {
    @Field()
    _id: string;

    @Field(() => FeedTypes)
    @Prop({ type: String, enum: FeedTypes })
    type: string;

    @Field(() => Post, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: Post.name, default: null })
    post: Types.ObjectId | null;

    @Field(() => Collection, { nullable: true })
    @Prop({
        type: Types.ObjectId,
        ref: Collection.name,
        default: null,
        index: true
    })
    _collection: Types.ObjectId | null;

    @Field(() => Hashtag, { nullable: true })
    @Prop({
        type: [{ type: Types.ObjectId, ref: Hashtag.name }],
        default: null,
        index: true
    })
    hashtags: Types.ObjectId[];

    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: USERS, index: true })
    owner: Types.ObjectId;

    @Field(() => Date, { nullable: true })
    createdAt: string;

    @Field(() => Date, { nullable: true })
    updatedAt: string;

    @Field(() => Date, { nullable: true })
    @Prop(Date)
    scheduledAt: Date;
}

export const FeedSchema = SchemaFactory.createForClass(Feed);
FeedSchema.index({ owner: 1, _collection: 1, hashtags: 1 });
