import { CreateReviewInput } from './create-review.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateReviewInput extends PartialType(CreateReviewInput) {
    @Field(() => String)
    id: string;
}
