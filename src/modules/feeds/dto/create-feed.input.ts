import { InputType, Field, ObjectType, Int } from '@nestjs/graphql';
import { ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { Feed } from '../entities/feed.entity';
import { Post } from '../entities/post.entity';

@InputType()
export class CreateOptionsInput {
    @Field()
    text: string;
}

@InputType()
export class TokenInputt {
    @Field(() => String, { nullable: true })
    name: string;

    @Field(() => String)
    contract: string;

    @Field(() => String)
    chain: string;

    @Field(() => String)
    tokenId: string;

    @Field(() => String, { nullable: true })
    image?: string;

    @Field(() => String, { nullable: true })
    collectionName: string;

    @Field(() => String, { nullable: true })
    collectionImage?: string;

    @Field(() => Boolean, { nullable: true })
    isMinted?: boolean;
}

@InputType()
export class CreatePollInput {
    @Field(() => [CreateOptionsInput])
    @ArrayNotEmpty()
    @IsNotEmpty()
    options: CreateOptionsInput[];

    @Field()
    @IsNotEmpty()
    question: string;

    @Field(() => Date)
    @IsNotEmpty()
    expiresAt: Date;
}

@InputType()
export class Token {
    @Field(() => String)
    tokenId: string;

    @Field(() => String)
    contract: string;

    @Field(() => String)
    chain: string;

    @Field(() => String)
    image: string;
}

@InputType()
export class CollectionInputTypes {
    @Field(() => String, { nullable: true })
    name: string;

    @Field(() => String)
    contract: string;

    @Field(() => String)
    chain: string;

    @Field(() => String, { nullable: true })
    image: string;
}

@InputType()
export class CreateCollectionPostInput {
    @Field(() => String)
    contract: string;

    @Field(() => String)
    chain: string;

    @Field(() => String)
    tokenId: string;
}

@InputType()
export class CreatePostInput {
    @Field(() => String, { description: 'Text field (placeholder)' })
    text: string;

    @Field(() => String, { nullable: true })
    linkPreview?: string;

    @Field(() => [String], {
        description: 'Media field (placeholder)',
        nullable: true
    })
    media: string[];

    // @Field(() => CollectionInputTypes, { nullable: true })
    // _collection?: CollectionInputTypes;

    @Field(() => Token, { nullable: true })
    token?: Token;

    @Field(() => TokenInputt, { nullable: true })
    tokenData?: TokenInputt;

    @Field(() => CreatePollInput, { nullable: true })
    poll?: CreatePollInput;

    @Field(() => Date, { nullable: true })
    scheduledAt?: Date;

    @Field(() => Boolean, { nullable: true })
    twitter?: boolean;

    @Field(() => Boolean, { nullable: true })
    linkedin?: boolean;

    @Field(() => Boolean, { nullable: true })
    facebook?: boolean;

    @Field(() => Boolean, { nullable: true })
    instagram?: boolean;

    @Field(() => String, { nullable: true })
    inReplyToPost?: string;

    @Field(() => String, { nullable: true })
    originalPost?: string;

    @Field(() => String, { nullable: true })
    _collection?: string;
}
@InputType()
export class CreateRePostInput {
    @Field(() => String, { description: 'Text field (placeholder)' })
    text: string;

    @Field(() => String, {
        nullable: true
    })
    originalPost: Types.ObjectId;
}

@InputType()
export class PostFilterInput {
    @Field(() => String, { nullable: true })
    author?: string;

    @Field(() => String, { nullable: true })
    hashtag?: string;

    @Field(() => Boolean, { nullable: true })
    repost?: boolean;

    @Field(() => Boolean, { nullable: true })
    scheduled?: boolean;
}

@InputType()
export class FeedFilterInput {
    @Field(() => String, {
        nullable: true,
        description: 'The id of the user who created feeds.'
    })
    owner: string;

    @Field(() => Boolean, { defaultValue: false })
    follow: boolean;

    @Field(() => String, {
        nullable: true
    })
    collection: string;
}

@ObjectType()
export class PageInfo {
    @Field(() => Boolean, { nullable: true })
    hasNextPage: boolean;

    @Field(() => String, { nullable: true })
    endCursor?: string | null;

    @Field(() => Int, { nullable: true })
    page?: number | null;

    @Field(() => Int, { nullable: true })
    pageSize?: number | null;

    @Field(() => Int, { nullable: true })
    totalCount?: number | null;

    @Field(() => Int, { nullable: true })
    nextPage?: number | null;
}

@ObjectType()
export class FeedConnection {
    @Field(() => [Feed])
    records: Feed[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
}

@ObjectType()
export class PostConnection {
    @Field(() => [Post])
    records: Post[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;

    @Field(() => Number)
    totalPostsCount: number;
}

@ObjectType()
export class PaginatedResults {
    @Field(() => [Post])
    records: Post[];

    @Field()
    hasNextPage: boolean;

    @Field({ nullable: true })
    cursor: string;

    @Field({ nullable: true })
    totalCount?: number;
}

@InputType()
export class PostTweetInput {
    @Field()
    status: string;

    @Field()
    imagePath: string;

    @Field()
    accessToken: string;

    @Field()
    accessSecret: string;
}

@ObjectType()
export class LinkPreviewResult {
    @Field(() => String, { nullable: true })
    url: string;
    @Field(() => String, { nullable: true })
    title: string;
    @Field(() => String, { nullable: true })
    description: string;
    @Field(() => String, { nullable: true })
    imageUrl: string;
}

@InputType()
export class CreateTwitterPostInput {
    @Field(() => String, { nullable: true })
    text?: string;

    @Field(() => String, { nullable: true })
    refVideo?: string;

    @Field(() => [String], {
        description: 'Media field (placeholder)',
        nullable: true
    })
    media: string[];
}

@ObjectType()
export class CreaatePostOutput {
    @Field(() => [Post])
    records: Post[];

    @Field()
    hasNextPage: boolean;

    @Field({ nullable: true })
    cursor: string;

    @Field({ nullable: true })
    totalCount?: number;
}
