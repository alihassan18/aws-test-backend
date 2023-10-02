// src/auth/socket-auth.middleware.ts
import { JwtPayload, verify } from 'jsonwebtoken';
import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
    userId: string; // The user ID attached to the socket after successful authentication
}

export function socketAuthMiddleware(
    socket: AuthenticatedSocket,
    next: (err?: Error) => void
): void {
    console.log('called');

    const token = socket?.handshake?.auth?.token;

    if (!token) {
        return next(new Error('Unauthorized'));
    }

    try {
        const payload = verify(token, process.env.JWT_SECRET) as JwtPayload;
        if (payload) {
            // Attach the user ID to the socket object for later use
            socket.userId = payload.sub;
            return next();
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Invalid token:', error.message);
        } else {
            console.error('Invalid token:', error);
        }
    }

    return next(new Error('Unauthorized'));
}
