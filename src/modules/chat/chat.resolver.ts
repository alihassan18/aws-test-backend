import {
    Resolver,
    Query,
    ResolveField,
    Parent,
    Context
} from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ContextProps } from 'src/interfaces/common.interface';
import { User, UserDocument } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Resolver(() => Chat)
export class ChatResolver {
    constructor(
        private readonly chatService: ChatService,
        private readonly userService: UsersService
    ) {}

    @ResolveField(() => User)
    async user1(@Parent() chat: Chat): Promise<UserDocument> {
        return this.userService.findById(chat.user1);
    }

    @ResolveField(() => User)
    async user2(@Parent() chat: Chat): Promise<UserDocument> {
        return this.userService.findById(chat.user2);
    }

    @ResolveField(() => Message)
    async lastMessage(@Parent() chat: Chat): Promise<Message> {
        return await this.chatService.findMessage(chat.lastMessage.toString());
    }

    @ResolveField(() => Number)
    async unseenMsgCount(
        @Parent() chat: Chat,
        @Context() context: ContextProps
    ): Promise<number> {
        const { _id: from } = context.req.user;
        return await this.chatService.getUnseenMsgCount(false, chat._id, from);
    }

    @UseGuards(AuthGuard)
    @Query(() => [Chat])
    async getChats(@Context() context: ContextProps) {
        const { _id: userId } = context.req.user;
        return await this.chatService.findAllChats(userId);
    }
}
