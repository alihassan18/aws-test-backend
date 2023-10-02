import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';

export type SocketWithUser = Socket & { userId: string };

export class SocketIOAdapter extends IoAdapter {
    constructor(private app: INestApplicationContext) {
        super(app);
    }

    createIOServer(port: number, options?: ServerOptions) {
        const optionsWithCORS = {
            ...options
        };
        const server: Server = super.createIOServer(port, optionsWithCORS);
        return server;
    }
}
