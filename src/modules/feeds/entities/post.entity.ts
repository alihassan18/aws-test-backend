import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Poll, PollSchema } from './poll.entity';
import { Hashtag } from './hashtag.entity';
import { /* COLLECTIONS, */ USERS } from 'src/constants/db.collections';
import { StakingCollection } from 'src/modules/staking/entities/collection.staking.entity';
import { Mrland } from 'src/modules/landmap/entities/mrland.entity';
import { Collection } from 'src/modules/collections/entities/collection.entity';

export type PostDocument = Post & Document;

@Schema()
@ObjectType()
export class Tokens {
    @Field(() => String)
    @Prop()
    tokenId: string;

    @Field(() => String)
    @Prop()
    contract: string;

    @Field(() => String)
    @Prop()
    chain: string;

    @Field(() => String, { nullable: true })
    @Prop()
    image: string;

    @Field(() => String, { nullable: true })
    @Prop()
    _id: Types.ObjectId;

    @Field(() => String, { nullable: true })
    @Prop()
    name: string;

    @Field(() => String, { nullable: true })
    @Prop({ default: null })
    owner: string;
}

// @Schema()
@ObjectType()
export class CollectionField {
    @Field(() => String, { nullable: true })
    @Prop()
    name: string;

    @Field(() => String)
    @Prop()
    contract: string;

    @Field(() => String)
    @Prop()
    chain: string;

    @Field(() => String, { nullable: true })
    @Prop()
    image?: string;
}

@ObjectType()
export class TokenField {
    @Field(() => String, { nullable: true })
    @Prop()
    name: string;

    @Field(() => String)
    @Prop()
    contract: string;

    @Field(() => String)
    @Prop()
    chain: string;

    @Field(() => String)
    @Prop()
    tokenId: string;

    @Field(() => String, { nullable: true })
    @Prop()
    image?: string;

    @Field(() => String, { nullable: true })
    @Prop()
    collectionName: string;

    @Field(() => String, { nullable: true })
    @Prop()
    collectionImage?: string;

    @Field(() => Boolean, { defaultValue: false, nullable: true })
    @Prop({ default: false })
    isMinted: boolean;
}

@ObjectType()
export class RepostedAt {
    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId;

    @Field(() => Date)
    repostedAt: Date;
}

@ObjectType()
export class ContractsData {
    @Field(() => String, { nullable: true })
    chain: string;

    @Field(() => String, { nullable: true })
    contract: string;
}

@ObjectType()
export class StageObject {
    @Field(() => String)
    @Prop()
    id: string;

    @Field(() => String)
    @Prop()
    title: string;

    @Field(() => String)
    @Prop()
    description: string;

    @Field(() => Date)
    @Prop()
    date: Date;
}
@Schema()
@ObjectType()
export class Collections {
    @Field(() => String, { nullable: true })
    @Prop()
    name: string;

    @Field(() => String)
    @Prop()
    contract: string;

    @Field(() => String)
    @Prop()
    chain: string;

    @Field(() => String, { nullable: true })
    @Prop()
    image: string;
}
@ObjectType()
@Schema({ timestamps: true })
export class Post extends Document {
    @Field(() => String, { nullable: true })
    _id?: string;

    @Field({ nullable: true })
    @Prop()
    text: string;

    @Field({ nullable: true })
    @Prop()
    linkPreview: string;

    @Field(() => [String], { nullable: true })
    @Prop([String])
    media: string[];

    @Field(() => User, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'User' })
    author: Types.ObjectId;

    @Field(() => StakingCollection, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: StakingCollection.name })
    staking: Types.ObjectId;

    @Field(() => Mrland, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: Mrland.name })
    mrland?: Types.ObjectId;

    @Field(() => [User], { nullable: true })
    @Prop({
        type: [{ type: Types.ObjectId, ref: 'User' }]
    })
    mentions: Types.ObjectId[];

    @Field(() => [Hashtag], { nullable: true })
    @Prop([{ type: Types.ObjectId, ref: Hashtag.name }])
    hashtags: Types.ObjectId[];

    @Field(() => Int, { nullable: true })
    @Prop({ default: 0 })
    videoViews?: number;

    @Field(() => Float, { defaultValue: 0 })
    @Prop({ default: 0 })
    postViews: number;

    @Field(() => [String], { defaultValue: [], nullable: true })
    @Prop({ type: [{ type: Types.ObjectId, ref: USERS }], default: [] })
    viewedBy?: Types.ObjectId[];

    @Field(() => Int, { defaultValue: 0 })
    @Prop({ default: 0 })
    reactionCount: number;

    @Field(() => Boolean, { defaultValue: false })
    @Prop({ default: false })
    isRepost: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean })
    twitterPost: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean })
    linkedinPost: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean })
    facebookPost: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean })
    instagramPost: boolean;

    @Field(() => Post, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'Post', default: null })
    originalPost: Types.ObjectId | null;

    @Field(() => Post, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'Post', default: null })
    inReplyToPost: Types.ObjectId | null;

    @Field(() => Collection, { nullable: true })
    @Prop({
        type: Types.ObjectId,
        ref: 'Collection'
    })
    _collection: Types.ObjectId;

    @Field(() => Collection, { nullable: true })
    @Prop({
        type: Types.ObjectId,
        ref: 'Collection'
    })
    collectionOfToken: Types.ObjectId;

    @Field(() => Tokens, { nullable: true })
    @Prop({ type: Tokens, default: null })
    token: Tokens;

    @Field(() => StageObject, { nullable: true })
    @Prop({ type: StageObject, default: null })
    stage: StageObject;

    @Field(() => CollectionField, { nullable: true })
    @Prop({ type: CollectionField, default: null })
    collectionData: CollectionField;

    @Field(() => TokenField, { nullable: true })
    @Prop({ type: TokenField, default: null })
    tokenData: TokenField;

    @Field(() => [User], { nullable: true })
    @Prop({ type: Types.ObjectId, ref: USERS, default: [] })
    collectionFollowers: Types.ObjectId[];

    @Field(() => Float, { defaultValue: 0 })
    @Prop({ default: 0 })
    collectionFollowersCount: number;

    @Field(() => Poll, { nullable: true })
    @Prop({ type: PollSchema, default: null })
    poll: Poll | null;

    @Field(() => [User], { nullable: true })
    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: null })
    repostedBy: Types.ObjectId[];

    @Field(() => [User], { nullable: true })
    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: null })
    commentsBy: Types.ObjectId[];

    @Field(() => Int, { defaultValue: 0, nullable: true })
    @Prop({ default: 0 })
    repostCount: number;

    @Field(() => [User], { nullable: true })
    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: null })
    quotedBy: Types.ObjectId[];

    @Field(() => Int, { defaultValue: 0, nullable: true })
    @Prop({ default: 0 })
    quoteCount: number;

    @Field(() => Int, { defaultValue: 0, nullable: true })
    @Prop({ default: 0 })
    commentsCount: number;

    @Field(() => [Reactions])
    @Prop()
    reactions: Reactions[];

    @Field(() => [RepostedAt], { nullable: true })
    @Prop({ type: [{ user: Types.ObjectId, repostedAt: Date }], default: [] })
    repostedAtByUsers: RepostedAt[];

    @Field(() => [Date], { defaultValue: [new Date()] })
    @Prop({ default: [new Date()] })
    collectionViewsTimestamps: Date[];

    @Field(() => Date, { nullable: true })
    @Prop(Date)
    scheduledAt: Date;

    @Field(() => Date, { nullable: true })
    createdAt: Date;

    @Field(() => Date, { nullable: true })
    updatedAt: Date;
}

@ObjectType()
export class Reactions {
    @Field(() => String, { nullable: true })
    emoji: string;

    @Field(() => Int, { defaultValue: 0, nullable: true })
    @Prop({ default: 0 })
    count: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
