// import { Inject, forwardRef } from '@nestjs/common';
// import {
//     OnGatewayConnection,
//     OnGatewayDisconnect,
//     OnGatewayInit,
//     SubscribeMessage,
//     WebSocketGateway,
//     WebSocketServer
// } from '@nestjs/websockets';
// import { Types } from 'mongoose';
// // import EventEmitter from 'events';
// import { Server, Socket } from 'socket.io';
// import { GET_GROUP_MESSAGE } from 'src/constants/socket.constants';
// // import { SHARED_EMITTER } from 'src/constants/socket.constants';
// import { ChatService } from 'src/modules/chat/chat.service';
// import { UsersService } from 'src/modules/users/users.service';

// @WebSocketGateway({ namespace: '/public' })
// export class PublicChatGateway
//     implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
// {
//     private clients = new Map<string, Socket[]>();

//     @WebSocketServer()
//     server: Server;

//     constructor(
//         // @Inject(SHARED_EMITTER) private readonly sharedEmitter: EventEmitter,
//         private readonly userService: UsersService,
//         @Inject(forwardRef(() => ChatService))
//         private readonly chatService: ChatService
//     ) {}

//     afterInit(server: Server) {
//         server.setMaxListeners(30);
//         console.log('Public FeedsGateway initialized chat');
//     }

//     handleConnection(socket: Socket) {
//         console.log(`Socket connected: ${socket.id} `);
//         // You can join a room, set up listeners, or perform other actions based on the user ID here.
//     }

//     handleDisconnect(client: Socket) {
//         console.log(`Client disconnected: ${client.id})`);
//         // You can leave a room, clean up resources, or perform other actions based on the user ID here.
//     }

//     @SubscribeMessage('joinPost')
//     handleJoinPost(client: Socket, postId: string): void {
//         if (!this.clients.has(postId)) {
//             this.clients.set(postId, []);
//         }
//         this.clients.get(postId).push(client);
//     }

//     @SubscribeMessage('leavePost')
//     handleLeavePost(client: Socket, postId: string): void {
//         const sockets = this.clients.get(postId);
//         if (sockets) {
//             const index = sockets.indexOf(client);
//             if (index > -1) {
//                 sockets.splice(index, 1);
//             }
//         }
//     }

//     // src/feeds/feeds.gateway.ts
//     @SubscribeMessage('joinRoom')
//     handleJoinRoom(client: Socket, room: string): void {
//         client.join(room);
//         client.emit('joinedRoom', room);
//     }

//     @SubscribeMessage('leaveRoom')
//     handleLeaveRoom(client: Socket, room: string): void {
//         client.leave(room);
//         client.emit('leftRoom', room);
//     }

//     @SubscribeMessage('message')
//     handleMessage(
//         client: Socket,
//         payload: { room: string; message: string }
//     ): void {
//         this.server.to(payload.room).emit('message', payload.message);
//     }

//     // async emitPostViews(payload: { postId: string; postViews: number }) {
//     //     const sockets = this.clients.get(payload.postId);

//     //     if (sockets) {
//     //         sockets.forEach((socket) => {
//     //             socket.emit(GET_POST_VIEWS, {
//     //                 data: payload
//     //             });
//     //         });
//     //     }
//     // }

//     // async emitCommentViews(payload: {
//     //     postId: string;
//     //     commentViews: number;
//     //     commentId: string;
//     // }) {
//     //     const sockets = this.clients.get(payload.postId);

//     //     if (sockets) {
//     //         sockets.forEach((socket) => {
//     //             socket.emit(GET_COMMENT_VIEWS, {
//     //                 data: payload
//     //             });
//     //         });
//     //     }
//     // }

//     // async emitReactionsOnPost(payload: {
//     //     postId: string;
//     //     reactionCounts: number;
//     // }) {
//     //     const sockets = this.clients.get(payload.postId);

//     //     if (sockets) {
//     //         sockets.forEach((socket) => {
//     //             socket.emit(GET_POST_REACTIONS, {
//     //                 data: payload
//     //             });
//     //         });
//     //     }
//     // }

//     // async emitReactionsOnComment(payload: {
//     //     postId: string;
//     //     reactionCounts: number;
//     //     commentId: string;
//     // }) {
//     //     const sockets = this.clients.get(payload.postId);

//     //     if (sockets) {
//     //         sockets.forEach((socket) => {
//     //             socket.emit(GET_POST_REACTIONS, {
//     //                 data: payload
//     //             });
//     //         });
//     //     }
//     // }

//     // async emitRepostCountOnPost(payload: {
//     //     postId: string;
//     //     repostCount: number;
//     // }) {
//     //     const sockets = this.clients.get(payload.postId);

//     //     if (sockets) {
//     //         sockets.forEach((socket) => {
//     //             socket.emit(GET_RESPOT_COUNTS, {
//     //                 data: payload
//     //             });
//     //         });
//     //     }
//     // }

//     async emitGroupMessages(messageId: Types.ObjectId) {
//         const message = await this.chatService.findMessage(
//             messageId.toString()
//         );
//         this.server.emit(GET_GROUP_MESSAGE, message);
//     }

//     async emitAcceptInvitation(messageId: Types.ObjectId) {
//         const message = await this.chatService.findMessage(
//             messageId.toString()
//         );
//         this.server.emit(GET_GROUP_MESSAGE, message);
//     }

//     async emitNotification(messageId: Types.ObjectId) {
//         const message = await this.chatService.findMessage(
//             messageId.toString()
//         );
//         this.server.emit(GET_GROUP_MESSAGE, message);
//     }
//     /* TODO: This feature is not yet implemented */
//     // async emitRepostCountOnComment(payload: {
//     //     postId: string;
//     //     repostCount: number;
//     // }) {
//     //     const sockets = this.clients.get(payload.postId);

//     //     if (sockets) {
//     //         sockets.forEach((socket) => {
//     //             socket.emit(GET_RESPOT_COUNTS, {
//     //                 data: payload
//     //             });
//     //         });
//     //     }
//     // }

//     async emitFeedData(event, payload) {
//         this.server.emit(event, {
//             data: payload
//         });
//     }

//     // Your public gateway methods...
// }
