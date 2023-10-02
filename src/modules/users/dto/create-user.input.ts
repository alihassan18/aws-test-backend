import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
    @Field(() => String, { description: 'Name field (placeholder)' })
    name: string;
}
