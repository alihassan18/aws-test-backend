import {
    Resolver,
    Query,
    Mutation,
    Args,
    ResolveField,
    Parent,
    Context
} from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Types } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ContextProps } from 'src/interfaces/common.interface';
import { Invitation } from './entities/invitation.entity';
import { User, UserDocument } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Group } from './entities/group.entity';

type GroupDocument = Group;

@Resolver(() => Invitation)
export class InvitationResolver {
    constructor(
        private readonly chatService: ChatService,
        private readonly userService: UsersService
    ) {}

    @ResolveField(() => User)
    async from(@Parent() invitation: Invitation): Promise<UserDocument> {
        return this.userService.findById(invitation.from);
    }

    @ResolveField(() => User)
    async to(@Parent() invitation: Invitation): Promise<UserDocument> {
        return this.userService.findById(invitation.to);
    }

    @ResolveField(() => Group)
    async groupId(@Parent() invitation: Invitation): Promise<GroupDocument> {
        const group = await this.chatService.findGroup(invitation.groupId);
        console.log('invitation group-', group);
        return group;
    }

    // Invitation-related resolvers

    // Invitation-related resolvers
    @UseGuards(AuthGuard)
    @Query(() => [Invitation])
    async invitations(@Context() context: ContextProps) {
        const { _id: userId } = context.req.user;
        return await this.chatService.findAllInvitations(userId);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Invitation)
    async inviteMember(
        @Args('groupId') groupId: string,
        @Args('userId') userId: string,
        @Context() context: ContextProps
    ) {
        const { _id: from } = context.req.user;
        return await this.chatService.inviteMember(
            from,
            new Types.ObjectId(userId),
            new Types.ObjectId(groupId)
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Invitation)
    async acceptInvitation(
        @Args('invitationId') invitationId: string,
        @Context() context: ContextProps
    ) {
        const { _id: userId } = context.req.user;
        return await this.chatService.acceptInvitation(
            new Types.ObjectId(invitationId),
            userId
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Invitation)
    async rejectInvitation(
        @Args('invitationId') invitationId: string,
        @Context() context: ContextProps
    ) {
        const { _id: userId } = context.req.user;
        return await this.chatService.rejectInvitation(
            new Types.ObjectId(invitationId),
            userId
        );
    }
}
