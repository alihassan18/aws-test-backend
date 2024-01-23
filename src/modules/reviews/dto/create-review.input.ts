import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { Review } from '../entities/review.entity';

@InputType()
export class CreateReviewInput {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number;
}

@ObjectType()
export class ReviewPagination {
    @Field(() => [Review])
    data: Review[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;
}
