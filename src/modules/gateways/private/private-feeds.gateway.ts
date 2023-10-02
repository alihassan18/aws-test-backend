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
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthenticatedSocket } from 'src/modules/auth/socket-auth.middleware';
// import { AuthGuard } from 'src/modules/auth/auth.guard';
import { WSJwtAuthGuard } from 'src/modules/auth/ws.auth.guard';
import { NotificationDocument } from 'src/modules/notifications/entities/notification.entity';
// import { socketAuthMiddleware } from 'src/modules/auth/socket-auth.middleware';

@Injectable()
// @UseGuards(AuthGuard)
@WebSocketGateway({ namespace: '/private' }) // you can specify a custom port here, e.g., @WebSocketGateway(3001)
export class PrivateFeedsGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
    @WebSocketServer() server: Server;

    constructor(
        // @Inject(SHARED_EMITTER) private readonly sharedEmitter: EventEmitter,
        private readonly authService: AuthService
    ) {}
    // configure(consumer: MiddlewareConsumer) {
    //     consumer.apply(socketAuthMiddleware).forRoutes(PrivateFeedsGateway);
    // }

    afterInit(server: Server) {
        server.setMaxListeners(30);
        console.log('Private FeedsGateway initialized');
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

    async sendMessageToUser(userId: string, message: string) {
        // Emit an event to a specific user (room)
        this.server.to(userId).emit('message', message);
    }

    async emitNotificationToUser(
        userId: string,
        notificationData: NotificationDocument
    ) {
        this.server.to(userId).emit('notification', notificationData);
    }
}
