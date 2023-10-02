// src/timeSpent/timeSpent.resolver.ts

import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { TimeSpentService } from './timespent.service';
import { Types } from 'mongoose';
import { TimeSpent } from './entities/timespent.entity';
import { AuthGuard } from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { ContextProps } from 'src/interfaces/common.interface';

@Resolver(() => TimeSpent)
export class TimeSpentResolver {
    constructor(private timeSpentService: TimeSpentService) {}

    @UseGuards(AuthGuard)
    @Mutation(() => TimeSpent)
    async addTimeSpentOnPost(
        @Args('postId') postId: string,
        @Args('time') time: number,
        @Context()
        context: ContextProps
    ): Promise<TimeSpent> {
        const { _id: userId } = context.req.user;

        return await this.timeSpentService.addTimeSpentOnPost(
            new Types.ObjectId(userId),
            new Types.ObjectId(postId),
            time
        );
    }

    // @UseGuards(AuthGuard)
    // @Mutation(() => TimeSpent)
    // async addTimeSpentOnComment(
    //     @Args('commentId') commentId: string,
    //     @Args('time') time: number,
    //     @Context()
    //     context: ContextProps
    // ): Promise<TimeSpent> {
    //     const { _id: userId } = context.req.user;

    //     return await this.timeSpentService.addTimeSpentOnComment(
    //         new Types.ObjectId(userId),
    //         new Types.ObjectId(commentId),
    //         time
    //     );
    // }

    @Query(() => Number)
    async getTotalTimeSpentOnPost(
        @Args('postId') postId: string
    ): Promise<number> {
        return await this.timeSpentService.getTotalTimeSpentOnPost(
            new Types.ObjectId(postId)
        );
    }

    // @Query(() => Number)
    // async getTotalTimeSpentOnComment(
    //     @Args('commentId') commentId: string
    // ): Promise<number> {
    //     return await this.timeSpentService.getTotalTimeSpentOnComment(
    //         new Types.ObjectId(commentId)
    //     );
    // }
}
