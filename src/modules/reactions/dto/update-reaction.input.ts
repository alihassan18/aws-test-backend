import { CreateReactionInput } from './create-reaction.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateReactionInput extends PartialType(CreateReactionInput) {
    @Field(() => Int)
    id: number;
}
