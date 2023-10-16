import { InjectModel } from '@nestjs/mongoose';
import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws'; // Import the WebSocket class
// import { Listing, ListingDocument } from '../listings/entities/listing.entity';
import { Model } from 'mongoose';
import { CollectionDocument } from '../collections/entities/collection.entity';
import { COLLECTIONS } from 'src/constants/db.collections';
import {
    Activity,
    ActivityDocument
} from '../activities/entities/activities.entity';
import { Wallet, WalletDocument } from '../users/entities/wallet.entity';
import { ActivityTypes } from '../activities/activities.enums';

const chain = 'arbitrum';

@WebSocketGateway()
export class EventsArbitrumGateway
    implements OnGatewayConnection, OnGatewayDisconnect
{
    @WebSocketServer()
    server: Server;

    constructor(
        // @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
        @InjectModel(COLLECTIONS)
        private collectionModel: Model<CollectionDocument>,
        @InjectModel(Activity.name)
        private activityModel: Model<ActivityDocument>,
        @InjectModel(Wallet.name)
        private walletModel: Model<WalletDocument>
    ) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        // Connect to the WebSocket URL
        const wssUrl =
            'wss://ws-arbitrum.reservoir.tools?api_key=9d4b2315-ed1a-5436-8392-f338f307857d';
        const wss = new WebSocket(wssUrl); // Use the imported WebSocket class
        console.log(wss);

        wss.on('open', () => {
            console.log('Connected to WebSocket');
        });

        wss.on('message', async function incoming(data) {
            const parsedData = JSON.parse(data);
            console.log(parsedData, 'data');
            if (parsedData?.event === 'ask.created') {
                self.createListings(parsedData.data);
            }
            if (parsedData?.event === 'bid.created') {
                self.createBid(parsedData.data);
            }
            // if (parsedData?.event === 'ask.updated') {
            //     if (
            //         parsedData?.data?.status == 'inactive' ||
            //         parsedData?.data?.status == 'expired' ||
            //         parsedData?.data?.status == 'cancelled'
            //     ) {
            //         self.deleteListing(parsedData.data);
            //     } else {
            //         self.updateListing(parsedData.data);
            //     }
            // }

            // if (parsedData?.event == 'token.created') {
            //     console.log(parsedData);
            //     self.createToken(parsedData.data?.token);
            // }
            // When the connection is ready, subscribe to the top-bids event
            if (JSON.parse(data).status === 'ready') {
                const collections = await self.collectionModel
                    .find({
                        chain: chain,
                        is_content_creator: true
                    })
                    .exec();

                if (collections.length) {
                    wss.send(
                        JSON.stringify({
                            type: 'subscribe',
                            event: 'ask.created',
                            status: 'success',
                            filters: {
                                contract: collections?.map((c) => c.contract)
                            }
                        })
                    );
                }
                if (collections.length) {
                    wss.send(
                        JSON.stringify({
                            type: 'subscribe',
                            event: 'bid.created',
                            status: 'success',
                            filters: {
                                contract: collections?.map((c) => c.contract)
                            }
                        })
                    );
                }
            }
        });

        wss.on('close', () => {
            console.log('Disconnected from WebSocket');
        });
        wss.on('error', (err) => {
            console.log('Disconnected from WebSocket', err);
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

    // {
    //     "event": "ask.created",
    //     "tags": {
    //         "contract": "0x556697ca91476b811f37a851dd2e53ae4c6024db",
    //         "source": "opensea.io",
    //         "maker": "0x0d135c0cceea42dff07edb0d890360bb3d12778a",
    //         "taker": "0x0000000000000000000000000000000000000000"
    //     },
    //     "data": {
    //         "id": "0x15059ad2b857e35fa8dced5f9fe8daeb7a743c8c0ab7386e8815666457086b5f",
    //         "kind": "seaport-v1.5",
    //         "side": "sell",
    //         "status": "active",
    //         "tokenSetId": "token:0x556697ca91476b811f37a851dd2e53ae4c6024db:942",
    //         "tokenSetSchemaHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    //         "nonce": 0,
    //         "contract": "0x556697ca91476b811f37a851dd2e53ae4c6024db",
    //         "maker": "0x0d135c0cceea42dff07edb0d890360bb3d12778a",
    //         "taker": "0x0000000000000000000000000000000000000000",
    //         "price": {
    //             "currency": {
    //                 "contract": "0x0000000000000000000000000000000000000000",
    //                 "name": "Ether",
    //                 "symbol": "ETH",
    //                 "decimals": 18
    //             },
    //             "amount": {
    //                 "raw": "29100000000000000",
    //                 "decimal": 0.0291,
    //                 "usd": 54.53858,
    //                 "native": 0.0291
    //             },
    //             "netAmount": {
    //                 "raw": "29100000000000000",
    //                 "decimal": 0.0291,
    //                 "usd": 54.53858,
    //                 "native": 0.0291
    //             }
    //         },
    //         "validFrom": 1687531925,
    //         "validUntil": 1687535525,
    //         "quantityFilled": 0,
    //         "quantityRemaining": 1,
    //         "criteria": {
    //             "kind": "token",
    //             "data": {
    //                 "token": {
    //                     "tokenId": "942",
    //                     "name": "Brawler #942",
    //                     "image": "https://i.seadn.io/gcs/files/36d6957e8ee6b41bd7e343229d678fd1.gif?w=500&auto=format"
    //                 },
    //                 "collection": {
    //                     "id": "0x556697ca91476b811f37a851dd2e53ae4c6024db",
    //                     "name": "Brawler Bearz",
    //                     "image": "https://i.seadn.io/gcs/files/0c60facb88a0601a07de92a59a23ba9a.gif?w=500&auto=format"
    //                 }
    //             }
    //         },
    //         "source": {
    //             "id": "0x5b3256965e7c3cf26e11fcaf296dfc8807c01073",
    //             "domain": "opensea.io",
    //             "name": "OpenSea",
    //             "icon": "https://raw.githubusercontent.com/reservoirprotocol/indexer/v5/src/models/sources/opensea-logo.svg",
    //             "url": "https://opensea.io/assets/ethereum/0x556697ca91476b811f37a851dd2e53ae4c6024db/942"
    //         },
    //         "feeBps": 0,
    //         "feeBreakdown": [],
    //         "expiration": 1687535525,
    //         "isReservoir": null,
    //         "isDynamic": false,
    //         "createdAt": "2023-06-23T14:52:07.224Z",
    //         "updatedAt": "2023-06-23T14:52:07.224Z",
    //         "rawData": {
    //             "kind": "single-token",
    //             "salt": "0x72db8c0b00000000000000000000000000000000000000005ec645e120ffebf5",
    //             "zone": "0x004c00500000ad104d7dbd00e3ae0a5c00560c00",
    //             "offer": [{
    //                 "token": "0x556697ca91476b811f37a851dd2e53ae4c6024db",
    //                 "itemType": 2,
    //                 "endAmount": "1",
    //                 "startAmount": "1",
    //                 "identifierOrCriteria": "942"
    //             }],
    //             "counter": "0",
    //             "endTime": 1687535525,
    //             "offerer": "0x0d135c0cceea42dff07edb0d890360bb3d12778a",
    //             "partial": true,
    //             "zoneHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    //             "orderType": 0,
    //             "startTime": 1687531925,
    //             "conduitKey": "0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000",
    //             "consideration": [{
    //                 "token": "0x0000000000000000000000000000000000000000",
    //                 "itemType": 0,
    //                 "endAmount": "29100000000000000",
    //                 "recipient": "0x0d135c0cceea42dff07edb0d890360bb3d12778a",
    //                 "startAmount": "29100000000000000",
    //                 "identifierOrCriteria": "0"
    //             }]
    //         }
    //     },
    //     "offset": "341121755",
    //     "published_at": 1687531927659,
    //     "type": "event",
    //     "status": "success"
    // }
    async createListings(data) {
        try {
            const [collection, wallet] = await Promise.all([
                this.collectionModel.findOne({
                    // chain: 'arbitrum',
                    contract: { $regex: new RegExp(`^${data?.contract}$`, 'i') }
                }),
                this.walletModel.findOne({
                    address: { $regex: new RegExp(`^${data?.maker}$`, 'i') }
                })
            ]);
            if (!collection) {
                return null;
            }

            const values = {
                user: wallet?.userId,
                nftCollection: collection?._id,
                type: ActivityTypes.NFT_LISTED,
                token: data?.criteria?.data?.token
            };
            const activity = await this.activityModel.findOne(values).exec();
            if (!activity) {
                this.activityModel
                    .create(values)
                    .then((activity) => {
                        console.log('Activity created:', activity);
                    })
                    .catch((error) => {
                        console.error('Error creating activity:', error);
                    });
            } else {
                console.log('This activity already exists.');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async createBid(data) {
        try {
            const [collection, wallet] = await Promise.all([
                this.collectionModel.findOne({
                    // chain: 'arbitrum',
                    contract: { $regex: new RegExp(`^${data?.contract}$`, 'i') }
                }),
                this.walletModel.findOne({
                    address: { $regex: new RegExp(`^${data?.maker}$`, 'i') }
                })
            ]);
            if (!collection) {
                return null;
            }

            const values = {
                user: wallet?.userId,
                nftCollection: collection?._id,
                type: ActivityTypes.BID_CREATED,
                token: data?.criteria?.data?.token
            };
            const activity = await this.activityModel.findOne(values).exec();
            if (!activity) {
                this.activityModel
                    .create(values)
                    .then((activity) => {
                        console.log('Activity created:', activity);
                    })
                    .catch((error) => {
                        console.error('Error creating activity:', error);
                    });
            } else {
                console.log('This activity already exists.');
            }
        } catch (error) {
            console.log(error);
        }
    }
}
