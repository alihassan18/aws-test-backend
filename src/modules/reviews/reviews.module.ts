import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsResolver } from './reviews.resolver';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [ReviewsResolver, ReviewsService]
})
export class ReviewsModule {}
