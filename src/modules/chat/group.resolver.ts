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
import { Message } from './entities/message.entity';
import { Group, MemberEntry } from './entities/group.entity';
import { Types } from 'mongoose';
import { User, UserDocument } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ContextProps } from 'src/interfaces/common.interface';
import { GroupPrivacyInput, GroupSettingInput } from './dto/update-group.input';

type MemberDocument = {
    member: User;
    addedBy: User;
};

@Resolver(() => Group)
export class GroupResolver {
    constructor(
        private readonly chatService: ChatService,
        private readonly userService: UsersService
    ) {}

    // Message-related resolvers

    @ResolveField(() => MemberEntry)
    async members(@Parent() group: Group): Promise<MemberDocument[]> {
        console.log(group);
        return Promise.all(
            group.members.map(async (member) => {
                return {
                    member: await this.userService.findById(member.member),
                    addedBy: await this.userService.findById(member.addedBy)
                };
            })
        );
    }

    @ResolveField(() => Message)
    async lastMessage(@Parent() group: Group): Promise<Message> {
        if (!group.lastMessage) return;
        return await this.chatService.findMessage(group.lastMessage.toString());
    }

    @ResolveField(() => Number)
    async unseenMsgCount(
        @Parent() group: Group,
        @Context() context: ContextProps
    ): Promise<number> {
        const { _id: from } = context.req.user;
        return await this.chatService.getUnseenMsgCount(true, group._id, from);
    }
    @ResolveField(() => User)
    async sender(@Parent() message: Message): Promise<UserDocument> {
        return this.userService.findById(message.sender);
    }

    @ResolveField(() => User)
    async admins(@Parent() group: Group): Promise<UserDocument[]> {
        return Promise.all(
            group.admins.map(async (admin) => {
                return this.userService.findById(admin);
            })
        );
    }

    // Group-related resolvers
    @UseGuards(AuthGuard)
    @Query(() => [Group])
    async groups(@Context() context: ContextProps) {
        const { _id: userId } = context.req.user;
        return await this.chatService.findAllGroups(userId);
    }

    @UseGuards(AuthGuard)
    @Query(() => Group)
    async group(
        @Args('groupId') groupId: string,
        @Context() context: ContextProps
    ) {
        const { _id: userId } = context.req.user;
        return await this.chatService.findUserGroup(
            new Types.ObjectId(groupId),
            userId
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Group)
    async createGroup(
        @Args('name') name: string,
        @Args('description') description: string,
        @Args('avatar') avatar: string,
        @Context() context: ContextProps
    ) {
        const { _id: createdBy } = context.req.user;
        return await this.chatService.createGroup({
            name,
            description,
            avatar,
            setting: {
                image: true,
                voice: true,
                video: true,
                files: true,
                gif: true,
                link: true,
                poll: true,
                mute: true
            },
            privacy: {
                invite: 0,
                post: 0,
                call: 0
            },
            createdBy: new Types.ObjectId(createdBy)
        });
    }
    @UseGuards(AuthGuard)
    @Mutation(() => Group)
    async updateGroup(
        @Args('groupId') groupId: string,
        @Args('name') name: string,
        @Args('description') description: string,
        @Args('avatar') avatar: string,
        @Context() context: ContextProps
    ) {
        const { _id: from } = context.req.user;
        return await this.chatService.updateGroup(from, groupId, {
            name,
            description,
            avatar
        });
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Group)
    async updateGroupSetting(
        @Args('groupId') groupId: string,
        @Args('setting') setting: GroupSettingInput,
        @Context() context: ContextProps
    ) {
        const { _id: userId } = context.req.user;
        return await this.chatService.updateGroupSetting(
            userId,
            groupId,
            setting
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Group)
    async updateGroupPrivacy(
        @Args('groupId') groupId: string,
        @Args('privacy') privacy: GroupPrivacyInput,
        @Context() context: ContextProps
    ) {
        const { _id: userId } = context.req.user;
        return await this.chatService.updateGroupPrivacy(
            userId,
            groupId,
            privacy
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Group)
    async joinGroup(
        @Args('groupId') groupId: string,
        @Context() context: ContextProps
    ) {
        const { _id: userId } = context.req.user;
        return await this.chatService.joinGroup(groupId, userId);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Group)
    async addNewMember(
        @Args('groupId') groupId: string,
        @Args('userId') userId: string,
        @Context() context: ContextProps
    ) {
        const { _id: addedBy } = context.req.user;
        return await this.chatService.addNewMember(
            groupId,
            new Types.ObjectId(userId),
            addedBy
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Group)
    async leaveGroup(
        @Args('groupId') groupId: string,
        @Context() context: ContextProps
    ) {
        const { _id: userId } = context.req.user;
        return await this.chatService.leaveGroup(groupId, userId);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Group)
    async makeRemoveAdminUser(
        @Args('groupId') groupId: string,
        @Args('userId') userId: string,
        @Context() context: ContextProps
    ) {
        const { _id: admin } = context.req.user;
        return await this.chatService.makeRemoveAdminUser(
            groupId,
            new Types.ObjectId(userId),
            admin
        );
    }
    @UseGuards(AuthGuard)
    @Mutation(() => Group)
    async removeMemberFromGroup(
        @Args('groupId') groupId: string,
        @Args('userId') userId: string,
        @Context() context: ContextProps
    ) {
        const { _id: removedBy } = context.req.user;
        return await this.chatService.removeMemberFromGroup(
            groupId,
            userId,
            new Types.ObjectId(removedBy)
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Group)
    async deleteGroup(
        @Args('groupId') groupId: string,
        @Context() context: ContextProps
    ) {
        const { _id: userId } = context.req.user;
        return await this.chatService.deleteGroup(groupId, userId);
    }
}
