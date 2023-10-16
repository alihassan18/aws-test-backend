import {
    Resolver,
    Query,
    Mutation,
    Args,
    Int,
    ResolveField,
    Parent,
    Context
} from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import {
    NotificationFilterInput,
    NotificationResults
} from './notification.dto';
import { User, UserDocument } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { PostService } from '../feeds/posts.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ContextProps } from 'src/interfaces/common.interface';
import { Types } from 'mongoose';
import { Post, PostDocument } from '../feeds/entities/post.entity';
import { SuccessPayload } from '../admin/dto/create-admin.input';

@Resolver(() => Notification)
export class NotificationResolver {
    constructor(
        private readonly notificationService: NotificationService,
        private readonly userService: UsersService,
        private readonly postSerivce: PostService
    ) {}

    @ResolveField(() => User)
    async receiver(
        @Parent() notification: Notification
    ): Promise<UserDocument> {
        return this.userService.findById(notification?.receiver, true);
    }

    @ResolveField(() => User)
    async from(@Parent() notification: Notification): Promise<UserDocument> {
        return this.userService.findById(notification?.from, true);
    }

    @ResolveField(() => Post)
    async post(@Parent() notification: Notification): Promise<PostDocument> {
        return this.postSerivce.findById(notification?.post);
    }

    @UseGuards(AuthGuard)
    @Query(() => NotificationResults, {
        name: 'notifications'
    })
    async findAll(
        @Context()
        context: ContextProps,
        @Args('query', { type: () => NotificationFilterInput, nullable: true })
        query: NotificationFilterInput,
        @Args('limit', { type: () => Int, defaultValue: 10 }) limit?: number,
        @Args('cursor', { type: () => String, nullable: true }) cursor?: string,
        @Args('currentPage', { type: () => Int, nullable: true })
        currentPage?: number
    ): Promise<NotificationResults> {
        const { _id: userId } = context.req.user;
        return this.notificationService.findAll(
            query,
            userId,
            limit,
            cursor,
            currentPage
        );
    }

    @Query(() => Notification, { name: 'notification', nullable: true })
    async findOne(@Args('id') id: string): Promise<Notification> {
        return await this.notificationService.findOne(id);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Notification)
    async markNotificationAsSeen(
        @Args('id') id: string,
        @Context()
        context: ContextProps
    ): Promise<Notification> {
        const { _id: userId } = context.req.user;
        return await this.notificationService.markAsSeen(
            new Types.ObjectId(id),
            userId
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => String)
    async markAllNotificationAsSeen(
        @Context()
        context: ContextProps
    ): Promise<string> {
        const { _id: userId } = context.req.user;
        return await this.notificationService.markAllAsSeen(userId);
    }

    @Mutation(() => Notification)
    async deleteNotification(@Args('id') id: string): Promise<Notification> {
        return await this.notificationService.delete(id);
    }

    @UseGuards(AuthGuard)
    @Query(() => Number, { name: 'getUnSeenCounts' })
    async getUnSeenCounts(
        @Context()
        context: ContextProps
    ): Promise<number> {
        const { _id: userId } = context.req.user;
        return await this.notificationService.getUnSeenCounts(
            new Types.ObjectId(userId)
        );
    }

    // FOR STAGE NOTIFICATIONS

    @UseGuards(AuthGuard)
    @Mutation(() => SuccessPayload)
    async stageInviteToFollowers(
        @Args('stageId') stageId: string,
        @Args('stageTitle') stageTitle: string,
        @Args('stageDesc') stageDesc: string,
        @Context()
        context: ContextProps
    ): Promise<SuccessPayload> {
        const { _id: userId } = context.req.user;
        return this.notificationService.stageInviteToFollowers(
            new Types.ObjectId(userId),
            stageId,
            stageTitle,
            stageDesc
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => SuccessPayload)
    async stageInviteToUser(
        @Args('stageId') stageId: string,
        @Args('stageTitle') stageTitle: string,
        @Args('stageDesc') stageDesc: string,
        @Args('userToInvite') userToInvite: string,
        @Context()
        context: ContextProps
    ): Promise<SuccessPayload> {
        const { _id: userId } = context.req.user;
        return this.notificationService.stageInviteToUser(
            new Types.ObjectId(userId),
            stageId,
            stageTitle,
            stageDesc,
            new Types.ObjectId(userToInvite)
        );
    }
}
