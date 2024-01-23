// review.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './entities/review.entity';
import { CreateReviewInput } from './dto/create-review.input';
import { UpdateReviewInput } from './dto/update-review.input';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>
    ) {}

    async create(createDto: CreateReviewInput): Promise<Review> {
        const createdReview = new this.reviewModel(createDto);
        return createdReview.save();
    }

    async findAll(
        page = 1,
        limit = 10
    ): Promise<{ data: Review[]; total: number; page: number; limit: number }> {
        const skip = (page - 1) * limit;
        const total = await this.reviewModel.countDocuments();
        const data = await this.reviewModel
            .find()
            .skip(skip)
            .limit(limit)
            .exec();

        return {
            data,
            total,
            page,
            limit
        };
    }

    async findOne(id: string): Promise<Review> {
        return this.reviewModel.findById(id).exec();
    }

    async update(id: string, updateDto: UpdateReviewInput): Promise<Review> {
        return this.reviewModel
            .findByIdAndUpdate(id, updateDto, { new: true })
            .exec();
    }

    async delete(id: string): Promise<ReviewDocument> {
        return this.reviewModel.findByIdAndRemove(id).exec();
    }
}
