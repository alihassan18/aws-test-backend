import { InjectModel } from '@nestjs/mongoose';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws'; // Import the WebSocket class
import { Listing, ListingDocument } from '../listings/entities/listing.entity';
import { Model } from 'mongoose';
import { CollectionDocument } from '../collections/entities/collection.entity';
import { COLLECTIONS } from 'src/constants/db.collections';
import { Nft, NftDocument } from '../nfts/entities/nft.entity';

const chain = 'avalance';
@WebSocketGateway()
export class EventsAvalancheGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
        @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
        @InjectModel(COLLECTIONS)
        private collectionModel: Model<CollectionDocument>,
        @InjectModel(Nft.name)
        private tokenModel: Model<NftDocument>
    ) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        // Connect to the WebSocket URL
        const wssUrl =
            'wss://ws-avalanche.reservoir.tools?api_key=0eab85dd-f45e-5587-a1df-9f536d267483';
        const wss = new WebSocket(wssUrl); // Use the imported WebSocket class

        wss.on('open', () => {
            console.log('Connected to WebSocket');
        });

        wss.on('message', async function incoming(data) {
            const parsedData = JSON.parse(data);
            if (parsedData?.event === 'ask.created') {
                self.createListings(parsedData.data);
            }
            if (parsedData?.event === 'ask.updated') {
                if (
                    parsedData?.data?.status == 'inactive' ||
                    parsedData?.data?.status == 'expired' ||
                    parsedData?.data?.status == 'cancelled'
                ) {
                    self.deleteListing(parsedData.data);
                } else {
                    self.updateListing(parsedData.data);
                }
            }

            if (parsedData?.event == 'token.created') {
                console.log(parsedData);
                self.createToken(parsedData.data?.token);
            }
            // When the connection is ready, subscribe to the top-bids event
            if (JSON.parse(data).status === 'ready') {
                const collections = await self.collectionModel
                    .find({ chain: chain })
                    .sort({ volume_1d: -1 })
                    .limit(100)
                    .exec();

                const contentCreator = await self.collectionModel
                    .find({
                        chain: chain,
                        is_content_creator: true
                    })
                    .exec();

                if (collections.length) {
                    wss.send(
                        JSON.stringify({
                            type: 'subscribe',
                            event: 'ask.*',
                            status: 'success',
                            filters: {
                                contract: collections?.map((c) => c.contract)
                            }
                        })
                    );
                }

                if (contentCreator.length > 0) {
                    wss.send(
                        JSON.stringify({
                            type: 'subscribe',
                            event: 'token.created',
                            status: 'success',
                            filters: {
                                contract: contentCreator?.map((c) => c.contract)
                            }
                        })
                    );
                }

                // To unsubscribe, send the following message
                // wss.send(
                //     JSON.stringify({
                //         type: 'unsubscribe',
                //         event: 'top-bid.changed',
                //     }),
                // );
            }
        });

        wss.on('close', () => {
            console.log('Disconnected from WebSocket');
        });
    }

    handleConnection(client: WebSocket) {
        console.log('Client connected:', client);

        client.on('message', (message: string) => {
            console.log('Received message:', message);
            // Process the received message
        });

        client.on('close', () => {
            console.log('Client disconnected');
        });
    }

    handleDisconnect(client: WebSocket) {
        console.log(client);

        console.log('Client disconnected');
    }

    async createListings(data) {
        try {
            const listing = await this.listingModel
                .findOne({
                    chain,
                    id: data?.id
                })
                .exec();
            if (listing) {
                console.log('This listing already exists', data?.id);

                return;
            }
            return this.listingModel.create({ ...data, chain: chain });
        } catch (error) {
            console.log(error);
        }
    }

    updateListing(data) {
        try {
            return this.listingModel.findOneAndUpdate(
                {
                    id: data?.id,
                    // tokenSetId: data?.tokenSetId,
                    chain: chain
                },
                data
            );
        } catch (error) {
            console.log(error);
        }
    }

    deleteListing(data) {
        try {
            return this.listingModel.findOneAndDelete({
                id: data?.id,
                chain: chain
            });
        } catch (error) {
            console.log(error);
        }
    }

    async createToken(data) {
        try {
            const token = await this.tokenModel
                .findOne({
                    contract: data?.contract,
                    chain: chain,
                    tokenId: data?.tokenId
                })
                .exec();
            if (token) {
                console.log('Token already exists');
                return;
            }
            return this.tokenModel.create({ ...data, chain: chain });
        } catch (error) {
            console.log(error);
        }
    }
}
