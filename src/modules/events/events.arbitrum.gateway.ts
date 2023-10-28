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
import { NotificationService } from '../notifications/notification.service';
import { ZackService } from '../zack/zack.service';
import { UserDocument } from '../users/entities/user.entity';
import { USERS } from 'src/constants/db.collections';

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
        private walletModel: Model<WalletDocument>,
        @InjectModel(USERS) readonly userModel: Model<UserDocument>,
        private readonly notifificationService: NotificationService
    ) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this;
        // Connect to the WebSocket URL
        const wssUrl = `wss://ws-arbitrum.reservoir.tools?api_key=${process.env.RESERVOIR_API_KEY}`;
        const wss = new WebSocket(wssUrl); // Use the imported WebSocket class

        wss.on('open', () => {
            console.log('Connected to WebSocket');
        });

        wss.on('message', async function incoming(data) {
            const parsedData = JSON.parse(data);

            if (parsedData?.event === 'ask.created') {
                // if (self.isNotValidData(parsedData.data)) {
                //     console.log('data is not valid');
                //     return;
                // }
                self.createListings(parsedData.data);
            }
            if (parsedData?.event === 'sale.created') {
                self.createSale(parsedData.data);
            }
            if (parsedData?.event === 'bid.created') {
                // if (self.isNotValidData(parsedData.data)) {
                //     console.log('data is not valid');
                //     return;
                // }
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
                    .select('contract')
                    .exec();

                if (collections.length) {
                    wss.send(
                        JSON.stringify({
                            type: 'subscribe',
                            event: 'ask.created',
                            status: 'success',
                            filters: {
                                contract: collections?.map((c) =>
                                    c.contract?.toLowerCase()
                                )
                            }
                        })
                    );
                }
                if (collections.length) {
                    wss.send(
                        JSON.stringify({
                            type: 'subscribe',
                            event: 'sale.created',
                            status: 'success',
                            filters: {
                                contract: collections?.map((c) =>
                                    c.contract?.toLowerCase()
                                )
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
                                contract: collections?.map((c) =>
                                    c.contract?.toLowerCase()
                                )
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

    isNotValidData(data) {
        if (!data) return false;
        if (data.id && typeof data.id !== 'string') return false;
        if (data.kind && typeof data.kind !== 'string') return false;
        if (data.side && typeof data.side !== 'string') return false;
        return true;
    }

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
                token: {
                    ...data?.criteria?.data?.token,
                    contract: collection?.contract?.toLowerCase()
                }
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

            if (wallet?.userId) {
                this.notifificationService.alertFollowers4List(wallet?.userId, {
                    ...data?.criteria?.data?.token,
                    contract: collection?.contract?.toLowerCase()
                });
            }
        } catch (error) {
            console.log(error);
        }
    }
    async createSale(data) {
        try {
            const [collection, to, from] = await Promise.all([
                this.collectionModel.findOne({
                    // chain: 'arbitrum',
                    contract: {
                        $regex: new RegExp(`^${data?.token?.contract}$`, 'i')
                    }
                }),
                this.walletModel.findOne({
                    address: { $regex: new RegExp(`^${data?.to}$`, 'i') }
                }),
                this.walletModel.findOne({
                    address: { $regex: new RegExp(`^${data?.from}$`, 'i') }
                })
            ]);
            if (!collection) {
                return null;
            }

            const values = {
                user: to?.userId,
                nftCollection: collection?._id,
                type: ActivityTypes.NFY_BUY,
                token: {
                    ...data?.token,
                    contract: collection?.contract?.toLowerCase()
                }
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

            // NOTIFY

            if (to?.userId && from?.userId && data?.token) {
                this.notifificationService.sendBoughtNftNotification(
                    to?.userId,
                    from?.userId,
                    {
                        ...data?.token,
                        contract: collection?.contract?.toLowerCase()
                    }
                );
            }
        } catch (error) {
            console.log(error);
        }
    }

    async createBid(data) {
        try {
            /* FS: ZACK: CREATE OFFER DM CREATE */
            /* Auth token */
            const zackService = new ZackService();
            await zackService.getAccessToken();
            /* FS: ZACK: CREATE OFFER DM END */
            console.log('data?.owner', data);
            const [collection, wallet, taker] = await Promise.all([
                this.collectionModel.findOne({
                    // chain: 'arbitrum',
                    contract: { $regex: new RegExp(`^${data?.contract}$`, 'i') }
                }),
                this.walletModel.findOne({
                    address: { $regex: new RegExp(`^${data?.maker}$`, 'i') }
                }),
                this.walletModel.findOne({
                    address: { $regex: new RegExp(`^${data?.taker}$`, 'i') }
                })
            ]);
            if (!collection) {
                return null;
            }

            const values = {
                user: wallet?.userId,
                nftCollection: collection?._id,
                type: ActivityTypes.BID_CREATED,
                token: {
                    ...data?.criteria?.data?.token,
                    contract: collection?.contract?.toLowerCase()
                }
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

            // NOTIFY
            if (
                wallet?.userId &&
                taker?.userId &&
                data?.criteria?.data?.token
            ) {
                this.notifificationService.sendOfferNotification(
                    wallet?.userId,
                    taker?.userId,
                    {
                        ...data?.criteria?.data?.token,
                        contract: collection?.contract?.toLowerCase()
                    }
                );
            }

            let ownerWallet = null;
            if (collection?.owner) {
                ownerWallet = await this.walletModel.findOne({
                    address: {
                        $regex: new RegExp(`^${collection?.owner}$`, 'i')
                    }
                });
            }
            console.log('ownerWallet', ownerWallet);

            let owner = null;
            if (ownerWallet.userId) {
                owner = await this.userModel.findOne({
                    _id: ownerWallet.userId
                });
            }

            let to_id = null;
            if (data.criteria.type == 'token') {
                to_id = '651e6250eb6e87da8b919464'; // replace this ntf owner.
            } else if (data.criteria.type == 'collection') {
                to_id = ownerWallet?.userId;
            }

            
            if (to_id) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dataPost: any = {
                    to_id: to_id,
                    send_by: wallet?.userId,
                    data: {
                        type:
                            data.criteria.type == 'token'
                                ? 'offer_nft'
                                : 'offer_collection',
                        content: '',
                        metadata: {
                            collection: collection,
                            wallet: wallet,
                            taker: taker,
                            owner: owner,
                            data: data
                        }
                    }
                };
                await zackService.sendMessagePrivate(dataPost);
            }
        } catch (error) {
            console.log(error);
        }
    }
}
