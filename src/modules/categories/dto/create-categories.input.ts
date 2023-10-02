import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCategoryInput {
    @Field(() => String, { description: 'Name of the staking collection' })
    name: string;
}
