import { CreateStakingCollectionInput } from './create-staking.input';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateStakingCollectionInput extends PartialType(
    CreateStakingCollectionInput
) {
    @Field(() => String)
    id: string;
}

@InputType()
export class StakingFilterInput {
    @Field(() => [String], { nullable: true })
    status?: string[];

    @Field(() => [String], { nullable: true })
    category?: string[];

    @Field(() => String, { nullable: true })
    keyword?: string;

    @Field(() => Int, { nullable: true })
    chainId?: number;
}
