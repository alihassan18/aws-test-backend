import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateStakingCollectionInput {
    // @Field(() => String, { description: 'Name of the staking collection' })
    // name: string;

    @Field(() => String, { description: 'Category of the staking collection' })
    category: string;

    @Field(() => String, { description: 'Utility of the staking collection' })
    utility: string;

    @Field(() => String, { description: 'Metaverse of the staking collection' })
    metaverse: string;

    @Field(() => String, {
        nullable: true,
        description: 'Chain of the staking collection'
    })
    chain?: string;

    @Field(() => Int, {
        nullable: true,
        description: 'Chain ID of the staking collection'
    })
    chainId?: number;

    @Field(() => String, {
        nullable: true,
        description: 'Token ID of the staking collection'
    })
    tokenId?: string;

    @Field(() => String, {
        nullable: true,
        description: 'Address of the collection'
    })
    collectionAddress?: string;

    @Field(() => String, {
        nullable: true,
        description: 'Name of the collection'
    })
    collectionName?: string;

    @Field(() => String, {
        nullable: true,
        description: 'Address of the token'
    })
    tokenAddress?: string;

    @Field(() => String, { nullable: true, description: 'Name of the token' })
    tokenName?: string;

    @Field(() => String, {
        nullable: true,
        description: 'Address of the staking contract'
    })
    stakingAddress?: string;

    // @Field(() => String, {
    //     nullable: true,
    //     description: 'Name of the staking contract'
    // })
    // stakingName?: string;

    @Field(() => String, { nullable: true, description: 'URL of the logo' })
    logoUrl?: string;

    @Field(() => String, { nullable: true, description: 'URL of the banner' })
    bannerUrl?: string;

    @Field(() => String, {
        nullable: true,
        description: 'Description of the staking collection'
    })
    description?: string;

    @Field(() => Date, {
        nullable: true,
        description: 'Description of the staking collection'
    })
    startedAt?: Date;

    // Add more fields as needed
}
