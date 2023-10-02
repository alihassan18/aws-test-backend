import {
    Resolver,
    Query,
    Mutation,
    Args,
    ResolveField,
    Parent,
    Context,
    Int
} from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { Emotion, Message } from './entities/message.entity';
import { Group } from './entities/group.entity';
import { Types } from 'mongoose';
import { User, UserDocument } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ContextProps } from 'src/interfaces/common.interface';
import {
    CreateGroupMessageInput,
    CreatePrivateMessageInput,
    MessageConnection
} from './dto/create-chat.input';

@Resolver(() => Message)
export class MessageResolver {
    constructor(
        private readonly chatService: ChatService,
        private readonly userService: UsersService
    ) {}

    // Message-related resolvers

    @ResolveField(() => Group)
    async receiverGroup(@Parent() message: Message): Promise<Group> {
        return this.chatService.findGroup(message.receiverGroup);
    }

    @ResolveField(() => User)
    async receiverUser(@Parent() message: Message): Promise<UserDocument> {
        return this.userService.findById(message.receiverUser);
    }

    @ResolveField(() => User)
    async members(@Parent() group: Group): Promise<UserDocument[]> {
        return Promise.all(
            group.members.map(async (member) => {
                return this.userService.findById(member.member);
            })
        );
    }

    @ResolveField(() => User)
    async sender(@Parent() message: Message): Promise<UserDocument> {
        return this.userService.findById(message.sender);
    }

    @ResolveField(() => Message)
    async inReplyToMessage(@Parent() message: Message) {
        return message.inReplyToMessage
            ? await this.chatService.findMessage(
                  message.inReplyToMessage.toString()
              )
            : null;
    }

    @ResolveField(() => Message)
    async emotions(@Parent() message: Message) {
        return message.emotions.map(async (emotion: Emotion) => {
            const user = await this.userService.findById(emotion.user);
            return { ...emotion, user };
        });
    }

    @UseGuards(AuthGuard)
    @Query(() => [Message])
    async messages() {
        return await this.chatService.findAllMessages();
    }

    @UseGuards(AuthGuard)
    @Query(() => Message)
    async message(@Args('id') id: string) {
        return await this.chatService.findMessage(id);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Message)
    async createMessage(
        @Args('content') content: string,
        @Context() context: ContextProps
    ) {
        const { _id: sender } = context.req.user;
        return await this.chatService.createMessage({
            content,
            sender: new Types.ObjectId(sender)
        });
    }

    @UseGuards(AuthGuard)
    @Query(() => MessageConnection)
    async groupMessages(
        @Args('groupId') groupId: string,
        @Context() context: ContextProps,
        @Args('cursor', { type: () => String, nullable: true }) cursor?: string,
        @Args('limit', { type: () => Int, nullable: true }) limit?: number
    ) {
        const { _id: userId } = context.req.user;
        const cursorObjectId = cursor ? new Types.ObjectId(cursor) : undefined;
        const { records, pageInfo, totalMessagesCount } =
            await this.chatService.findAllGroupMessages(
                userId,
                groupId,
                cursorObjectId,
                limit
            );
        return {
            records,
            pageInfo,
            totalMessagesCount
        };
    }

    @UseGuards(AuthGuard)
    @Query(() => MessageConnection)
    async privateMessages(
        @Args('receiverId') receiverId: string,
        @Context() context: ContextProps,
        @Args('cursor', { type: () => String, nullable: true }) cursor?: string,
        @Args('limit', { type: () => Int, nullable: true }) limit?: number
    ) {
        const { _id: userId } = context.req.user;
        const cursorObjectId = cursor ? new Types.ObjectId(cursor) : undefined;

        const { records, pageInfo, totalMessagesCount } =
            await this.chatService.findAllPrivateMessages(
                userId,
                new Types.ObjectId(receiverId),
                cursorObjectId,
                limit
            );
        return {
            records,
            pageInfo,
            totalMessagesCount
        };
    }

    @UseGuards(AuthGuard)
    @Query(() => [Message])
    async supportMessages(@Context() context: ContextProps) {
        const { _id: userId } = context.req.user;
        return await this.chatService.findAllSupportMessages(userId);
    }
    @UseGuards(AuthGuard)
    @Mutation(() => Message)
    async createGroupMessage(
        @Args('createGroupMessageInput')
        createGroupMessageInput: CreateGroupMessageInput,
        @Context() context: ContextProps
    ) {
        const { _id: senderId } = context.req.user;
        return await this.chatService.createGroupMessage(
            senderId,
            createGroupMessageInput
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Message)
    async createSupportMessage(
        @Args('createSupportMessageInput')
        createSupportMessageInput: CreatePrivateMessageInput,
        @Context() context: ContextProps
    ) {
        const { _id: senderId } = context.req.user;
        return await this.chatService.createSupportMessage(
            senderId,
            createSupportMessageInput
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Message)
    async deleteMessage(
        @Args('messageId')
        messageId: string,
        @Args('toAll')
        toAll: boolean,
        @Context() context: ContextProps
    ) {
        const { _id: senderId } = context.req.user;
        return await this.chatService.deleteMessage(messageId, senderId, toAll);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    async deleteDirectChat(
        @Args('userId')
        userId: string,
        @Args('toAll')
        toAll: boolean,
        @Context() context: ContextProps
    ) {
        const { _id: senderId } = context.req.user;
        return await this.chatService.deleteChat(
            new Types.ObjectId(userId),
            senderId,
            toAll
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Message)
    async createPrivateMessage(
        @Args('createPrivateMessageInput')
        createPrivateMessageInput: CreatePrivateMessageInput,
        @Context() context: ContextProps
    ) {
        const { _id: senderId } = context.req.user;
        return await this.chatService.createPrivateMessage(
            senderId,
            createPrivateMessageInput
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Message)
    async setMessagePinned(
        @Args('messageId')
        messageId: string,
        @Args('isPinned')
        pinned: boolean,
        @Context() context: ContextProps
    ) {
        const { _id: senderId } = context.req.user;
        console.log(senderId);
        return await this.chatService.updateMessageStatus(messageId, {
            pinned
        });
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    async setEmotion(
        @Args('messageId')
        messageId: string,
        @Args('emoji')
        emoji: string,
        @Context() context: ContextProps
    ) {
        const { _id: senderId } = context.req.user;
        return await this.chatService.setEmotion(
            new Types.ObjectId(messageId),
            emoji,
            new Types.ObjectId(senderId)
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    async emitTypingEvent(
        @Args('groupId')
        _id: string,
        @Context() context: ContextProps
    ) {
        const { _id: senderId, userName } = context.req.user;
        const groupId = new Types.ObjectId(_id);

        return await this.chatService.emitTypingEvent(
            groupId,
            senderId,
            userName
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    async removeTypingEvent(
        @Args('groupId')
        _id: string,
        @Context() context: ContextProps
    ) {
        const { _id: senderId } = context.req.user;
        const groupId = new Types.ObjectId(_id);

        return await this.chatService.removeTypingEvent(groupId, senderId);
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    async setMessageSeen(
        @Args('messageId')
        _id: string,
        @Context() context: ContextProps
    ) {
        const { _id: senderId } = context.req.user;

        return await this.chatService.setMessageSeen(_id, senderId);
    }
    // Add more query and mutation resolvers as needed
}
