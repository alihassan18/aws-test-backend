import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/user/public' })
export class PublicUserGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private clients = new Map<string, Socket[]>();

    @WebSocketServer()
    server: Server;

    afterInit(server: Server) {
        server.setMaxListeners(30);
        console.log('Public FeedsGateway initialized chat');
    }

    handleConnection(socket: Socket) {
        console.log(`Socket connected: ${socket.id} `);
        // You can join a room, set up listeners, or perform other actions based on the user ID here.
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id})`);
        // You can leave a room, clean up resources, or perform other actions based on the user ID here.
    }

    @SubscribeMessage('joinPost')
    handleJoinPost(client: Socket, postId: string): void {
        if (!this.clients.has(postId)) {
            this.clients.set(postId, []);
        }
        this.clients.get(postId).push(client);
    }

    @SubscribeMessage('leavePost')
    handleLeavePost(client: Socket, postId: string): void {
        const sockets = this.clients.get(postId);
        if (sockets) {
            const index = sockets.indexOf(client);
            if (index > -1) {
                sockets.splice(index, 1);
            }
        }
    }

    // src/feeds/feeds.gateway.ts
    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string): void {
        client.join(room);
        client.emit('joinedRoom', room);
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(client: Socket, room: string): void {
        client.leave(room);
        client.emit('leftRoom', room);
    }

    @SubscribeMessage('message')
    handleMessage(
        client: Socket,
        payload: { room: string; message: string }
    ): void {
        this.server.to(payload.room).emit('message', payload.message);
    }

    // async emitUserUpdated(info: ProfileInput, userId: string) {
    //     this.server.emit(USER_UPDATED, { userId, info });
    // }

    // Your public gateway methods...
}
