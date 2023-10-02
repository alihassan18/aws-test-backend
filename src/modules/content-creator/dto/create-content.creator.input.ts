import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/modules/feeds/dto/create-feed.input';
import { ContentCreator } from '../entities/content.creator.entity';

@InputType()
export class CreateContentCreatorInput {
    @Field(() => String, { description: 'Name field (placeholder)' })
    name: string;

    @Field(() => String, {
        description: 'Contract address field (placeholder)'
    })
    contract: string;

    @Field(() => String, { description: 'Chain name field (placeholder)' })
    chain: string;

    @Field(() => Int, { description: 'Chain id field (placeholder)' })
    chainId: number;

    // @Field(() => String, {
    //     description: 'Contract address field (placeholder)'
    // })
    // contract: string;

    @Field(() => Int, { description: 'Total supply field (placeholder)' })
    items_total: number;

    @Field(() => String, { description: 'symbol field (placeholder)' })
    symbol: string;

    @Field(() => Boolean, { description: 'Auto auction field (placeholder)' })
    autoAuction: boolean;

    @Field(() => Int, {
        description: 'Description field (placeholder)',
        nullable: true
    })
    description?: number;

    @Field(() => String, { nullable: true })
    website: string;

    @Field(() => String, { nullable: true })
    twitter?: string;

    @Field(() => String, { nullable: true })
    discord?: string;

    @Field(() => String, { nullable: true })
    telegram?: string;

    @Field(() => String, { nullable: true })
    web?: string;

    @Field(() => String, { nullable: true })
    github?: string;

    @Field(() => String, { nullable: true })
    instagram?: string;

    @Field(() => String, { nullable: true, defaultValue: 'ERC721' })
    erc_type: string;

    @Field(() => String, { nullable: true })
    owner: string;

    @Field(() => Int, { nullable: true })
    royalty: number;
}

@InputType()
export class ContentCreatorSortInput {
    @Field(() => String)
    type: string;

    @Field(() => Int)
    value: number;
}

@InputType()
export class ContentCreatorFilterInput {
    @Field(() => [String], { nullable: true })
    chain?: string[];

    @Field(() => String, { nullable: true })
    creator?: string;

    @Field(() => ContentCreatorSortInput, { nullable: true })
    sort?: ContentCreatorSortInput;
}

@ObjectType()
export class ContentCreatorResponse {
    @Field(() => [ContentCreator])
    records: ContentCreator[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
}
