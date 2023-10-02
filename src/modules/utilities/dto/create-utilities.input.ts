import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUtilityInput {
    @Field(() => String, { description: 'Name of the staking collection' })
    name: string;
}
