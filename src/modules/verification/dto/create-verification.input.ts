import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateVerificationInput {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number;
}
