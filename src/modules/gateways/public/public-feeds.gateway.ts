import { Inject, Injectable, Scope, forwardRef } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Types } from 'mongoose';
// import EventEmitter from 'events';
import { Server, Socket } from 'socket.io';
import {
    GET_COMMENT_VIEWS,
    GET_DELETED_POST,
    GET_FEEDS,
    GET_MONTH_SCORERES,
    GET_POST_COMMENT_COUNT,
    GET_POST_REACTIONS,
    GET_POST_VIEWS,
    GET_QOUTE_COUNTS,
    GET_REPOST_COUNTS
} from 'src/constants/socket.constants';
import { differenceInSeconds } from 'src/helpers/common.helpers';
import { Post, Reactions } from 'src/modules/feeds/entities/post.entity';
// import { SHARED_EMITTER } from 'src/constants/socket.constants';
import { FeedsService } from 'src/modules/feeds/feeds.service';
import { PostService } from 'src/modules/feeds/posts.service';
import { UsersService } from 'src/modules/users/users.service';

@WebSocketGateway({ namespace: '/public' })
@Injectable({ scope: Scope.DEFAULT })
export class PublicFeedsGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private clients = new Map<string, Socket[]>();
    private joinTime = new Map<string, Map<string, Date>>();

    @WebSocketServer()
    server: Server;

    constructor(
        // @Inject(SHARED_EMITTER) private readonly sharedEmitter: EventEmitter,
        private readonly userService: UsersService,
        @Inject(forwardRef(() => FeedsService))
        private readonly feedsService: FeedsService,
        private readonly postService: PostService
    ) {
        console.log(this.joinTime);
        console.log('PublicFeedsGateway');
    }

    afterInit(server: Server) {
        server.setMaxListeners(30);
        console.log('Public FeedsGateway initialized public');
    }

    handleConnection(socket: Socket) {
        console.log(`Socket connected: ${socket.id} Feeds`);
        // You can join a room, set up listeners, or perform other actions based on the user ID here.
    }

    async handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id})`);
        // You can leave a room, clean up resources, or perform other actions based on the user ID here.

        // await Promise.all(
        //     Array.from(this.clients.entries()).map(
        //         async ([postId, clients]) => {
        //             if (clients.includes(client)) {
        //                 const joinTime = this.joinTime.get(client.id);
        //                 if (joinTime) {
        //                     const timeSpent =
        //                         new Date().getTime() - joinTime.getTime();
        //                     this.joinTime.delete(client.id);
        //                     return this.postService.updateTimeSpentOnPost(
        //                         new Types.ObjectId(postId),
        //                         timeSpent / 1000
        //                     ); // convert ms to seconds
        //                 }
        //             }
        //         }
        //     )
        // );
        const clientJoinTimes = this.joinTime.get(client.id);
        if (clientJoinTimes) {
            await Promise.all(
                Array.from(clientJoinTimes.entries()).map(
                    async ([postId, joinTime]) => {
                        const timeSpent = differenceInSeconds(
                            new Date(),
                            joinTime
                        );
                        return this.postService.updateTimeSpentOnPost(
                            new Types.ObjectId(postId),
                            Math.round(timeSpent)
                        );
                    }
                )
            );
            // Remove the client's join times after updating post view counts
            this.joinTime.delete(client.id);
        }

        // Remove the client from all posts' clients lists
        this.clients.forEach((clients) => {
            const index = clients.indexOf(client);
            if (index > -1) {
                clients.splice(index, 1);
            }
        });
    }

    @SubscribeMessage('joinPost')
    handleJoinPost(client: Socket, postId: string): void {
        if (!this.clients.has(postId)) {
            this.clients.set(postId, []);
        }
        this.clients.get(postId).push(client);

        // Check if the map for this client exists, if not create a new one
        if (!this.joinTime.has(client.id)) {
            this.joinTime.set(client.id, new Map<string, Date>());
        }

        // Get the client's map and set the join time for this post
        this.joinTime.get(client.id).set(postId, new Date());
    }

    @SubscribeMessage('leavePost')
    async handleLeavePost(client: Socket, postId: string) {
        const sockets = this.clients.get(postId);
        if (sockets) {
            const index = sockets.indexOf(client);
            if (index > -1) {
                sockets.splice(index, 1);
            }

            const clientJoinTimes = this.joinTime.get(client.id);
            if (clientJoinTimes) {
                const joinTime = clientJoinTimes.get(postId);
                if (joinTime) {
                    const leaveTime = new Date();
                    const timeSpent = differenceInSeconds(leaveTime, joinTime);
                    clientJoinTimes.delete(postId);

                    await this.postService.updateTimeSpentOnPost(
                        new Types.ObjectId(postId),
                        Math.round(timeSpent)
                    );
                }
            }
        }
        // const joinTime = this.joinTime.get(client.id);

        // if (joinTime) {
        //     const timeSpent = new Date().getTime() - joinTime.getTime();
        //     console.log(timeSpent, joinTime.getTime());

        //     this.joinTime.delete(client.id);
        //     await this.postService.updateTimeSpentOnPost(
        //         new Types.ObjectId(postId),
        //         timeSpent / 1000
        //     ); // convert ms to seconds
        // }
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

    async emitPostViews(payload: { postId: string; postViews: number }) {
        const sockets = this.clients.get(payload.postId);
        if (sockets) {
            sockets.forEach((socket) => {
                socket.emit(GET_POST_VIEWS, {
                    data: payload
                });
            });
        }
    }

    async emitCommentViews(payload: {
        postId: string;
        commentViews: number;
        commentId: string;
    }) {
        const sockets = this.clients.get(payload.postId);
        if (sockets) {
            sockets.forEach((socket) => {
                socket.emit(GET_COMMENT_VIEWS, {
                    data: payload
                });
            });
        }
    }

    async emitReactionsOnPost(payload: {
        postId: string;
        reactions: Reactions[];
    }) {
        const sockets = this.clients.get(payload.postId);

        if (sockets) {
            sockets.forEach((socket) => {
                socket.emit(GET_POST_REACTIONS, {
                    data: payload
                });
            });
        }
    }

    async emitReactionsOnComment(payload: {
        postId: string;
        reactionCounts: number;
        commentId: string;
    }) {
        const sockets = this.clients.get(payload.postId);

        if (sockets) {
            sockets.forEach((socket) => {
                socket.emit(GET_POST_REACTIONS, {
                    data: payload
                });
            });
        }
    }

    async emitRepostCountOnPost(payload: {
        postId: string;
        repostCount: number;
    }) {
        const sockets = this.clients.get(payload.postId);
        if (sockets) {
            sockets.forEach((socket) => {
                socket.emit(GET_REPOST_COUNTS, {
                    data: payload
                });
            });
        }
    }

    async emitQouteCountOnPost(payload: {
        postId: string;
        qouteCount: number;
    }) {
        const sockets = this.clients.get(payload.postId);
        if (sockets) {
            sockets.forEach((socket) => {
                socket.emit(GET_QOUTE_COUNTS, {
                    data: payload
                });
            });
        }
    }

    async emitCommentCountOnPost(payload: {
        postId: string;
        commentCounts: number;
        commentsBy?: Types.ObjectId[];
    }) {
        const sockets = this.clients.get(payload.postId);
        if (sockets) {
            sockets.forEach((socket) => {
                socket.emit(GET_POST_COMMENT_COUNT, {
                    data: payload
                });
            });
        }
    }

    async emitFeeds(feedId: Types.ObjectId) {
        const feed = await this.feedsService.findFeedByIdP(feedId);
        this.server.emit(GET_FEEDS, feed);
    }

    async emitDeletePost(post: Post) {
        this.server.emit(GET_DELETED_POST, {
            postId: post._id,
            inReplyToPost: post.inReplyToPost,
            type: post.inReplyToPost ? 'COMMENT' : 'POST'
        });
    }

    /* TODO: This feature is not yet implemented */
    async emitRepostCountOnComment(payload: {
        postId: string;
        repostCount: number;
    }) {
        const sockets = this.clients.get(payload.postId);

        if (sockets) {
            sockets.forEach((socket) => {
                socket.emit(GET_REPOST_COUNTS, {
                    data: payload
                });
            });
        }
    }

    async emitFeedData(event, payload) {
        this.server.emit(event, {
            data: payload
        });
    }

    async emitTopScorersData(payload) {
        this.server.emit(GET_MONTH_SCORERES, {
            data: payload
        });
    }

    // Your public gateway methods...
}
