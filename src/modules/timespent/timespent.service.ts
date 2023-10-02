// src/timeSpent/timeSpent.service.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { TimeSpent, TimeSpentDocument } from './entities/timespent.entity';
import { Post, PostDocument } from '../feeds/entities/post.entity';
import { PublicFeedsGateway } from '../gateways/public/public-feeds.gateway';

@Injectable()
export class TimeSpentService {
    constructor(
        @InjectModel(TimeSpent.name)
        private timeSpentModel: Model<TimeSpentDocument>,
        @InjectModel(Post.name)
        private postModel: Model<PostDocument>,
        private publicFeedsGateway: PublicFeedsGateway
    ) {}

    async addTimeSpentOnPost(
        userId: Types.ObjectId,
        postId: Types.ObjectId,
        time: number
    ): Promise<TimeSpent> {
        const post = await this.postModel.findById(postId).exec();
        if (!post) {
            throw new Error('Post not found');
        }
        const query = {
            user: userId,
            post: postId
        };

        const existingTimeSpent = await this.timeSpentModel
            .findOne(query)
            .exec();

        if (existingTimeSpent) {
            existingTimeSpent.timeSpent += time;
            post.postViews += time;
            post.save();
            this.publicFeedsGateway.emitPostViews({
                postId: postId.toString(),
                postViews: post.postViews + time
            });
            return await existingTimeSpent.save();
        } else {
            const newTimeSpent = new this.timeSpentModel({
                user: userId,
                post: postId,
                timeSpent: time
            });
            post.postViews += time;
            post.save();
            this.publicFeedsGateway.emitPostViews({
                postId: postId.toString(),
                postViews: post.postViews + time
            });
            return await newTimeSpent.save();
        }
    }

    async getTotalTimeSpentOnPost(postId: Types.ObjectId): Promise<number> {
        const post = await this.postModel.findById(postId).exec();
        if (!post) {
            throw new Error('Post not found');
        }

        const timeSpentOnPost = await this.timeSpentModel
            .aggregate([
                { $match: { post: postId } },
                { $group: { _id: null, total: { $sum: '$timeSpent' } } }
            ])
            .exec();

        const totalTimeSpent = timeSpentOnPost[0]?.total || 0;
        return totalTimeSpent;
    }
}
