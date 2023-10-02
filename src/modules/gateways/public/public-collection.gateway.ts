import { Inject, forwardRef } from '@nestjs/common';
import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { differenceInSeconds } from 'date-fns';
import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';
import {
    GET_COLLECTIONS_UPDATE,
    GET_COLLECTION_VIEWS
    // GET_ISLAND,
    // GET_MRLANDS
} from 'src/constants/socket.constants';
import { CollectionsService } from 'src/modules/collections/collections.service';
import { CollectionDocument } from 'src/modules/collections/entities/collection.entity';
import { NftsService } from 'src/modules/nfts/nfts.service';
// import { Island } from 'src/modules/landmap/entities/island.entity';
// import { Mrland } from 'src/modules/landmap/entities/mrland.entity';
// import { SHARED_EMITTER } from 'src/constants/socket.constants';

@WebSocketGateway({ namespace: '/collection/public' })
export class PublicCollectionGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
    private clients = new Map<string, Socket[]>();
    private joinTime = new Map<string, Map<string, Date>>();

    @WebSocketServer()
    server: Server;

    constructor(
        // @Inject(SHARED_EMITTER) private readonly sharedEmitter: EventEmitter,
        @Inject(forwardRef(() => CollectionsService))
        private readonly collectionService: CollectionsService,
        @Inject(forwardRef(() => NftsService))
        private readonly nftService: NftsService
    ) {}

    afterInit(server: Server) {
        server.setMaxListeners(30);
        console.log('Public FeedsGateway initialized chat');
    }

    handleConnection(socket: Socket) {
        console.log(`Socket connected: ${socket.id} collection 1`);
        // You can join a room, set up listeners, or perform other actions based on the user ID here.
    }

    async handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id})`);
        // You can leave a room, clean up resources, or perform other actions based on the user ID here.
        const clientJoinTimes = this.joinTime.get(client.id);
        if (clientJoinTimes) {
            await Promise.all(
                Array.from(clientJoinTimes.entries()).map(
                    async ([collectionId, joinTime]) => {
                        const timeSpent = differenceInSeconds(
                            new Date(),
                            joinTime
                        );
                        return this.collectionService.updateTimeSpentOnCollection(
                            new Types.ObjectId(collectionId),
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
    }

    @SubscribeMessage('joinCollection')
    habdleJoinCollection(client: Socket, collectionId: string): void {
        console.log('join collectionId', collectionId);
        if (!this.clients.has(collectionId)) {
            this.clients.set(collectionId, []);
        }
        this.clients.get(collectionId).push(client);

        // Check if the map for this client exists, if not create a new one
        if (!this.joinTime.has(client.id)) {
            this.joinTime.set(client.id, new Map<string, Date>());
        }

        // Get the client's map and set the join time for this post
        this.joinTime.get(client.id).set(collectionId, new Date());
    }

    @SubscribeMessage('leaveCollection')
    async handleLeaveCollection(client: Socket, collectionId: string) {
        console.log('collectionId', collectionId);
        const sockets = this.clients.get(collectionId);
        if (sockets) {
            const index = sockets.indexOf(client);
            if (index > -1) {
                sockets.splice(index, 1);
            }

            const clientJoinTimes = this.joinTime.get(client.id);
            if (clientJoinTimes) {
                const joinTime = clientJoinTimes.get(collectionId);
                if (joinTime) {
                    const leaveTime = new Date();
                    const timeSpent = differenceInSeconds(leaveTime, joinTime);
                    clientJoinTimes.delete(collectionId);

                    await this.collectionService.updateTimeSpentOnCollection(
                        new Types.ObjectId(collectionId),
                        Math.round(timeSpent)
                    );
                }
            }
        }
    }

    @SubscribeMessage('joinNft')
    handleJoinNft(client: Socket, nftId: string): void {
        if (!this.clients.has(nftId)) {
            this.clients.set(nftId, []);
        }
        this.clients.get(nftId).push(client);

        // Check if the map for this client exists, if not create a new one
        if (!this.joinTime.has(client.id)) {
            this.joinTime.set(client.id, new Map<string, Date>());
        }

        // Get the client's map and set the join time for this post
        this.joinTime.get(client.id).set(nftId, new Date());
    }

    @SubscribeMessage('leaveNft')
    async handleLeaveNft(client: Socket, nftId: string) {
        const sockets = this.clients.get(nftId);
        if (sockets) {
            const index = sockets.indexOf(client);
            if (index > -1) {
                sockets.splice(index, 1);
            }

            const clientJoinTimes = this.joinTime.get(client.id);
            if (clientJoinTimes) {
                const joinTime = clientJoinTimes.get(nftId);
                if (joinTime) {
                    const leaveTime = new Date();
                    const timeSpent = differenceInSeconds(leaveTime, joinTime);
                    clientJoinTimes.delete(nftId);
                    await this.nftService.updateNftViews(
                        new Types.ObjectId(nftId),
                        Math.round(timeSpent)
                    );
                }
            }
        }
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

    async emitColletionData(data: Partial<CollectionDocument>) {
        this.server.emit(GET_COLLECTIONS_UPDATE, data);
    }

    async emitCollectionViews(payload: {
        collectionId: string;
        collectionViews: number;
    }) {
        const sockets = this.clients.get(payload.collectionId);
        console.log('collectionId payload', payload);
        if (sockets) {
            sockets.forEach((socket) => {
                socket.emit(GET_COLLECTION_VIEWS, {
                    data: payload
                });
            });
        }
    }

    // Your public gateway methods...
}
