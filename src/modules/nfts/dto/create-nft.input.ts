import {
    InputType,
    Int,
    Field,
    ObjectType,
    registerEnumType
} from '@nestjs/graphql';
import { Nft } from '../entities/nft.entity';
import { PageInfo } from 'src/modules/feeds/dto/create-feed.input';

@InputType()
export class CreateNftInput {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number;
}

// Define the possible status values as an enum
export enum ListingStatus {
    LISTED = 'listed',
    ALL = 'all',
    AUCTION = 'auction'
}

// Register the enum type with TypeGraphQL
registerEnumType(ListingStatus, {
    name: 'ListingStatus',
    description: 'Possible listing status values'
});

@InputType()
class AttributeFilterInput {
    @Field(() => String)
    key: string;

    @Field(() => [String])
    values: string[];
}

@InputType()
export class TokenFilterInput {
    @Field(() => String, { nullable: true })
    keyword?: string;

    @Field(() => String, { nullable: true })
    chain?: string;

    @Field(() => String, { nullable: true })
    creator?: string;

    @Field(() => String, { nullable: true })
    contract?: string;

    // @Field(() => String, { nullable: true })
    // deployer_address?: string;

    @Field(() => String, { nullable: true })
    owner?: string;

    @Field(() => String, { nullable: true })
    follower?: string;

    @Field(() => Boolean, { nullable: true })
    is_content_creator?: boolean;

    @Field(() => Boolean, { nullable: true })
    is_auto_auction?: boolean;

    @Field(() => String, { defaultValue: ListingStatus.ALL, nullable: true })
    status?: ListingStatus;

    @Field(() => [AttributeFilterInput], { nullable: true })
    attributes: AttributeFilterInput[];
    // @Field(() => CollectionSortInput, { nullable: true })
    // sort?: CollectionSortInput;
}

@ObjectType()
export class TokensResponse {
    @Field(() => [Nft])
    records: Nft[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
}

@ObjectType()
export class TokensCountsByStatus {
    @Field(() => Int)
    listings: number;

    @Field(() => Int)
    tokens: number;

    @Field(() => Int)
    bids: number;
}

@ObjectType()
export class UserStats {
    @Field(() => Int)
    minted: number;

    @Field(() => Int)
    owned: number;

    @Field(() => Int)
    sold: number;

    @Field(() => Int)
    bought: number;

    @Field(() => Int)
    listed: number;
}

@InputType()
export class HiddenTokensInput {
    @Field(() => String, { nullable: true })
    chain?: string;

    @Field(() => String, { nullable: true })
    tokenId?: string;

    @Field(() => String, { nullable: true })
    contract?: string;

    @Field(() => String, { nullable: true })
    userId?: string;
}
