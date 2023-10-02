import { Injectable, UseGuards } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
    CHAT_DELETED,
    GET_ACCEPT_INVITATION,
    GET_CHAT_UPDATED,
    GET_GROUP_INVITATION,
    GET_GROUP_MESSAGE,
    GET_GROUP_MESSAGE_NOTIFICATION,
    GET_GRUOP_UPDATED,
    GET_MESSAGE_SEEN,
    GET_PRIVATE_MESSAGE,
    GET_PRIVATE_MESSAGE_NOTIFICATION,
    SET_CLOSE_GROUP,
    SET_LEAVE_GROUP,
    SET_MESSAGE_DELETED,
    SET_REMOVE_FROM_GROUP,
    TYPING_MESSAGE
} from 'src/constants/socket.constants';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthenticatedSocket } from 'src/modules/auth/socket-auth.middleware';
// import { AuthGuard } from 'src/modules/auth/auth.guard';
import { WSJwtAuthGuard } from 'src/modules/auth/ws.auth.guard';
import { Chat } from 'src/modules/chat/entities/chat.entity';
import { Group } from 'src/modules/chat/entities/group.entity';
import { Invitation } from 'src/modules/chat/entities/invitation.entity';
import { Message } from 'src/modules/chat/entities/message.entity';
import { NotificationDocument } from 'src/modules/notifications/entities/notification.entity';
// import { socketAuthMiddleware } from 'src/modules/auth/socket-auth.middleware';

@Injectable()
// @UseGuards(AuthGuard)
@WebSocketGateway({ namespace: 'private' }) // you can specify a custom port here, e.g., @WebSocketGateway(3001)
export class PrivateChatGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
    @WebSocketServer() server: Server;
    public onlineUsers: string[] = [];

    constructor(
        // @Inject(SHARED_EMITTER) private readonly sharedEmitter: EventEmitter,
        private readonly authService: AuthService
    ) {}
    // configure(consumer: MiddlewareConsumer) {
    //     consumer.apply(socketAuthMiddleware).forRoutes(PrivateChatGateway);
    // }

    afterInit(server: Server) {
        server.setMaxListeners(30);
        console.log('Private ChatGateway initialized');
    }

    async handleConnection(socket: AuthenticatedSocket) {
        try {
            const token = socket.handshake.query.token;
            if (typeof token !== 'string') {
                socket.emit('error', { message: 'Authentication failed' });
                socket.disconnect(true);
                return;
            }
            const user = await this.authService.validateToken(token);
            if (!user) {
                // Emit an error event to the client and disconnect the socket
                socket.emit('error', { message: 'Authentication failed' });
                socket.disconnect(true);
                return;
            }

            // Store the userId in the client object for later use.
            socket.userId = user._id;

            // Join the room with the userId.
            socket.join(user._id);

            console.log(
                `Socket connected: ${socket.id} (User: ${socket.userId})---`
            );

            this.server.emit('addOnlineUser', user._id);
            this.onlineUsers = [
                ...this.onlineUsers.filter((item) => item !== user._id),
                user._id
            ];
            socket.emit('setOnlineUsers', this.onlineUsers);
            // You can join a room, set up listeners, or perform other actions based on the user ID here.
        } catch (error) {
            // Emit an error event to the client and disconnect the socket
            socket.emit('error', { message: 'Invalid or expired token' });
            socket.disconnect(true);
        }
    }

    handleDisconnect(client) {
        console.log(
            `Client disconnected: ${client.id} (User: ${client.userId})`
        );
        this.onlineUsers = [
            ...this.onlineUsers.filter((item) => item !== client.userId)
        ];
        client.userId && this.server.emit('removeOnlineUser', client.userId);
        // You can leave a room, clean up resources, or perform other actions based on the user ID here.
    }

    @UseGuards(WSJwtAuthGuard)
    @SubscribeMessage('event')
    handleEvent(/* client: Socket, payload: any */): string {
        // Handle the event and payload here
        return 'Hello world!';
    }

    async emitFeedData(event, payload) {
        this.server.emit(event, {
            data: payload
        });
    }

    async emitGroupMessage(userId: string, data: Message) {
        // Emit an event to a specific user (room)
        this.server.to(userId).emit(GET_GROUP_MESSAGE, data);
        data.type === 'group' &&
            this.server.to(userId).emit(GET_GROUP_MESSAGE_NOTIFICATION, data);
    }

    async emitPrivateMessage(userId: string, data: Message) {
        // Emit an event to a specific user (room)
        this.server.to(userId).emit(GET_PRIVATE_MESSAGE, data);
        data.type === 'private' &&
            this.server.to(userId).emit(GET_PRIVATE_MESSAGE_NOTIFICATION, data);
    }
    async emitMessageDeleted(userId: string, data: string) {
        // Emit an event to a specific user (room)
        this.server.to(userId).emit(SET_MESSAGE_DELETED, data);
    }

    async emitGetInvitation(userId: string, data: Invitation) {
        // Emit an event to a specific user (room)
        this.server.to(userId).emit(GET_GROUP_INVITATION, data);
    }

    async emitGroupUpdated(
        userId: string,
        data: { group: Group; message: string }
    ) {
        // Emit an event to a specific user (room)
        this.server.to(userId).emit(GET_GRUOP_UPDATED, data);
    }

    async emitChatUpdated(
        userId: string,
        data: { chat: Chat; message: string }
    ) {
        // Emit an event to a specific user (room)
        this.server.to(userId).emit(GET_CHAT_UPDATED, data);
    }
    async emitAcceptInvitation(userId: string, data: string) {
        // Emit an event to a specific user (room)
        this.server.to(userId).emit(GET_ACCEPT_INVITATION, data);
    }

    async emitRemoveUserFromGroup(userId: string, groupId: string) {
        // Emit an event to a specific user (room)
        this.server.to(userId).emit(SET_REMOVE_FROM_GROUP, groupId);
    }

    async emitLeaveGroup(userId: string, groupId: string) {
        // Emit an event to a specific user (room)
        this.server.to(userId).emit(SET_LEAVE_GROUP, groupId);
    }

    async emitCloseGroup(
        userId: string,
        data: { groupId: string; message: string }
    ) {
        // Emit an event to a specific user (room)
        this.server.to(userId).emit(SET_CLOSE_GROUP, data);
    }

    async emitNotificationToUser(
        userId: string,
        notificationData: NotificationDocument
    ) {
        this.server.to(userId).emit('notification', notificationData);
    }

    async emitTypingMessage(userId: string, events: unknown) {
        this.server.to(userId).emit(TYPING_MESSAGE, events);
    }

    async emitChatDeleted(userId: string, chatId: string) {
        this.server.to(userId).emit(CHAT_DELETED, chatId);
    }

    async emitMessageSeen(
        userId: string,
        data: {
            groupId?: string;
            chatId?: string;
            count?: number;
            msgId?: string;
        }
    ) {
        this.server.to(userId).emit(GET_MESSAGE_SEEN, data);
    }
}
