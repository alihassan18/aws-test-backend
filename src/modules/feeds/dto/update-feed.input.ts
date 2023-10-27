import { Types } from 'mongoose';
import { CreatePostInput } from './create-feed.input';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

@InputType()
export class UpdateFeedInput extends PartialType(CreatePostInput) {
    @Field(() => String)
    id: Types.ObjectId;

    @Field(() => String, { nullable: true })
    _id?: string;

    @Field({ nullable: true })
    text: string;

    @Field(() => [String], { nullable: true })
    media: string[];

    // @Field(() => [User], { nullable: true })
    // mentions: Types.ObjectId[];

    // @Field(() => [Hashtag], { nullable: true })
    // hashtags: Types.ObjectId[];

    @Field(() => Int, { nullable: true })
    videoViews?: number;

    @Field(() => Int, { defaultValue: 0 })
    postViews: number;

    @Field(() => [String], { defaultValue: [], nullable: true })
    viewedBy?: Types.ObjectId[];

    @Field(() => Int, { defaultValue: 0 })
    reactionCount: number;

    @Field(() => Boolean, { defaultValue: false })
    isRepost: boolean;

    // @Field(() => Post, { nullable: true })
    // originalPost: Types.ObjectId | null;

    // @Field(() => Post, { nullable: true })
    // _collection: Types.ObjectId;

    // @Field(() => User, { nullable: true })
    // repostedBy: Types.ObjectId[];

    @Field(() => Int, { defaultValue: 0, nullable: true })
    repostCount: number;

    // @Field(() => User, { nullable: true })
    // quotedBy: Types.ObjectId[];

    @Field(() => Int, { defaultValue: 0, nullable: true })
    quoteCount: number;

    @Field(() => Int, { defaultValue: 0, nullable: true })
    commentsCount: number;

    @Field(() => Date, { nullable: true })
    scheduledAt: Date;

    @Field(() => Date, { nullable: true })
    createdAt: Date;

    @Field(() => Date, { nullable: true })
    updatedAt: Date;
}

@InputType()
export class UpdateNftForPost {
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
    collectionId?: string;
}

@InputType()
export class CollectionInput {
    @Field(() => String)
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

    @Field(() => String, { nullable: true })
    @Prop()
    banner?: string;
}

@InputType()
export class TokenInput {
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

    @Field(() => String)
    @Prop()
    collectionName: string;

    @Field(() => String, { nullable: true })
    @Prop()
    collectionImage?: string;
}

@InputType()
export class StageInput {
    @Field(() => String)
    author: string;

    @Field(() => String)
    @Prop()
    id: string;

    @Field(() => String)
    @Prop()
    title: string;

    @Field(() => String)
    @Prop()
    description: string;
}

export interface QueryOfDuplicateC {
    author: Types.ObjectId;
    text: string;
    createdAt: {
        $gte: Date;
    };
    inReplyToPost?:Types.ObjectId
}