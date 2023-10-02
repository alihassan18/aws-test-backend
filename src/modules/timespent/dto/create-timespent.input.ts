import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTimespentInput {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number;
}
