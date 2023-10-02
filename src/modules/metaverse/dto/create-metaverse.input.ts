import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMetaverseInput {
    @Field(() => String, { description: 'Name of the staking collection' })
    name: string;
}
