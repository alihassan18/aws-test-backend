import { InputType, Field, Int, registerEnumType } from '@nestjs/graphql';

enum SortByOptions {
    '1DayVolume',
    '7DayVolume',
    '30DayVolume',
    'allTimeVolume',
    'createdAt',
    'floorAskPrice'
}

registerEnumType(SortByOptions, {
    name: 'SortByOptions'
});

@InputType()
export class CollectionQueryInput {
    @Field({ nullable: true })
    id?: string;

    @Field({ nullable: true })
    chain?: string;

    @Field({ nullable: true })
    slug?: string;

    @Field({ nullable: true })
    collectionsSetId?: string;

    @Field({ nullable: true })
    community?: string;

    @Field({ nullable: true })
    contract?: string;

    @Field({ nullable: true })
    name?: string;

    @Field(() => Int, { nullable: true })
    maxFloorAskPrice?: number;

    @Field(() => Int, { nullable: true })
    minFloorAskPrice?: number;

    @Field({ nullable: true })
    includeTopBid?: boolean;

    @Field({ nullable: true })
    includeAttributes?: boolean;

    @Field({ nullable: true })
    includeSalesCount?: boolean;

    @Field({ nullable: true })
    includeMintStages?: boolean;

    @Field({ nullable: true })
    normalizeRoyalties?: boolean;

    @Field({ nullable: true })
    useNonFlaggedFloorAsk?: boolean;

    @Field(() => SortByOptions, { nullable: true })
    sortBy?: SortByOptions;

    @Field(() => Int, { nullable: true, defaultValue: 10 })
    limit?: number;

    @Field({ nullable: true })
    continuation?: string;

    @Field({ nullable: true })
    displayCurrency?: string;
}
