import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { Review } from './entities/review.entity';
import { CreateReviewInput, ReviewPagination } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';
import { ReviewsService } from './reviews.service';

@Resolver(() => Review)
export class ReviewsResolver {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Mutation(() => Review)
    createReview(
        @Args('createReviewInput') createReviewInput: CreateReviewInput
    ) {
        return this.reviewsService.create(createReviewInput);
    }

    @Query(() => ReviewPagination)
    async reviews(
        @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
        @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number
    ) {
        return this.reviewsService.findAll(page, limit);
    }

    @Query(() => Review, { name: 'review' })
    findOne(@Args('id', { type: () => Int }) id: string) {
        return this.reviewsService.findOne(id);
    }

    @Mutation(() => Review)
    updateReview(
        @Args('updateReviewInput') updateReviewInput: UpdateReviewInput
    ) {
        return this.reviewsService.update(
            updateReviewInput.id,
            updateReviewInput
        );
    }

    @Mutation(() => Review)
    removeReview(@Args('id', { type: () => Int }) id: string) {
        return this.reviewsService.delete(id);
    }
}
