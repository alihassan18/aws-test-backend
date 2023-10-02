import { Injectable } from '@nestjs/common';
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@Injectable()
@WebSocketGateway() // you can specify a custom port here, e.g., @WebSocketGateway(3001)
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    afterInit(server: Server) {
        server.setMaxListeners(30);
    }

    handleConnection(client: Socket) {
        console.log('Client connected:', client.id);
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected:', client.id);
    }

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
}
