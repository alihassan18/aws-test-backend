import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';

import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
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
import { ReservoirService } from '../shared/services/reservoir.service';
import { zeroAddress } from 'viem';
import { PublicFeedsGateway } from '../gateways/public/public-feeds.gateway';
import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ScoresService } from '../scores/scores.service';
import { Sales, SalesDocument } from '../sales/entities/sales.entity';

// const chain = 'arbitrum';

@WebSocketGateway()
// OnGatewayConnection,
// OnGatewayDisconnect,
export class EventsArbitrumGateway implements OnModuleInit, OnModuleDestroy {
    @WebSocketServer()
    server: Server;

    private wss: WebSocket;
    private readonly wssUrl: string;
    private isConnected = false;

    constructor(
        // @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
        @InjectModel(COLLECTIONS)
        private collectionModel: Model<CollectionDocument>,
        @InjectModel(Sales.name)
        private salesModel: Model<SalesDocument>,
        @InjectModel(Activity.name)
        private activityModel: Model<ActivityDocument>,
        @InjectModel(Wallet.name)
        private walletModel: Model<WalletDocument>,
        private readonly reservoirService: ReservoirService,
        @InjectModel(USERS) readonly userModel: Model<UserDocument>,
        private readonly notifificationService: NotificationService,
        private publicFeedsGateway: PublicFeedsGateway,
        private readonly scoresService: ScoresService
    ) {
        this.wssUrl = `wss://ws-arbitrum.reservoir.tools?api_key=${process.env.RESERVOIR_API_KEY}`;
    }

    onModuleInit() {
        this.connect();
    }

    onModuleDestroy() {
        this.disconnect();
    }

    private connect() {
        this.wss = new WebSocket(this.wssUrl);

        this.wss.on('open', () => {
            this.isConnected = true;
            console.log('WebSocket connected');
            // Perform any subscriptions here
        });

        this.wss.on('message', async (data) => {
            const parsedData = JSON.parse(data);

            if (parsedData?.event === 'ask.created') {
                this.createListings(parsedData.data);
            }
            if (parsedData?.event === 'sale.created') {
                this.createSale(parsedData.data);
            }
            if (parsedData?.event === 'bid.created') {
                this.createBid(parsedData.data);
            }

            // When the connection is ready, subscribe to the top-bids event
            if (JSON.parse(data).status === 'ready') {
                this.wss.send(
                    JSON.stringify({
                        type: 'subscribe',
                        event: 'ask.created',
                        status: 'success',
                        filters: {
                            source: 'mintstargram.tech'
                        }
                    })
                );

                this.wss.send(
                    JSON.stringify({
                        type: 'subscribe',
                        event: 'sale.created',
                        status: 'success',
                        filters: {
                            source: 'mintstargram.tech'
                        }
                    })
                );

                this.wss.send(
                    JSON.stringify({
                        type: 'subscribe',
                        event: 'bid.created',
                        status: 'success',
                        filters: {
                            source: 'mintstargram.tech'
                        }
                    })
                );
            }
        });

        this.wss.on('close', () => {
            this.isConnected = false;
            console.log('WebSocket disconnected, attempting to reconnect...');
            setTimeout(() => this.connect(), 5000); // Reconnect after 5 seconds
        });

        this.wss.on('error', (err) => {
            console.error('WebSocket encountered an error:', err);
            this.wss.close(); // Close the connection if an error occurs
        });
    }

    private disconnect() {
        if (this.wss) {
            this.wss.close();
        }
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
            console.log(data, 'data');

            const values = {
                user: wallet?.userId,
                price: data?.price,
                nftCollection: collection?._id,
                type: ActivityTypes.NFT_LISTED,
                token: {
                    ...data?.criteria?.data?.token,
                    contract: collection?.contract?.toLowerCase()
                }
            };
            // const activity = await this.activityModel.findOne(values).exec();
            // if (!activity) {
            this.activityModel
                .create(values)
                .then(async (activity) => {
                    const data = await this.activityModel
                        .findById(activity?._id)
                        .populate('user') // Populate the 'user' field
                        .populate('post') // Populate the 'post' field
                        .populate('nftCollection') // Populate the 'nftCollection' field
                        .exec();

                    this.publicFeedsGateway.emitRecentActivities(data);
                    console.log('Activity created:', activity);
                })
                .catch((error) => {
                    console.error('Error creating activity:', error);
                });
            /*  } else {
                console.log('This activity already exists.');
            } */

            if (wallet?.userId) {
                this.notifificationService.alertFollowers4List(wallet?.userId, {
                    ...data?.criteria?.data?.token,
                    contract: collection?.contract?.toLowerCase()
                });

                this.scoresService.createScore(wallet.userId, 'list');
            }
        } catch (error) {
            console.log(error);
        }
    }

    async createSale(data) {
        try {
            console.log(data, 'data');

            const sales = await this.salesModel.findOneAndUpdate(
                { id: data?.id },
                data,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
            console.log(sales, 'sales');

            // This means the user in minting the token and we are just listning for the buy transactions.
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

            const values = {
                user: to?.userId,
                nftCollection: collection?._id,
                price: data?.price,
                type:
                    data?.from === zeroAddress
                        ? ActivityTypes.NFT_MINTED
                        : ActivityTypes.NFY_BUY,
                token: {
                    ...data?.token,
                    contract: collection?.contract?.toLowerCase()
                }
            };

            this.activityModel
                .create(values)
                .then(async (activity) => {
                    const data = await this.activityModel
                        .findById(activity?._id)
                        .populate('user') // Populate the 'user' field
                        .populate('post') // Populate the 'post' field
                        .populate('nftCollection') // Populate the 'nftCollection' field
                        .exec();

                    this.publicFeedsGateway.emitRecentActivities(data);
                    console.log('Activity created:', activity);
                })
                .catch((error) => {
                    console.error('Error creating activity:', error);
                });

            // NOTIFY

            if (to?.userId) {
                this.scoresService.createScore(to?.userId, 'buyNft');
            }
            if (from?.userId) {
                this.scoresService.createScore(to?.userId, 'sellNft');
            }

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
                price: data?.price,
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
                    .then(async (activity) => {
                        const data = await this.activityModel
                            .findById(activity?._id)
                            .populate('user') // Populate the 'user' field
                            .populate('post') // Populate the 'post' field
                            .populate('nftCollection') // Populate the 'nftCollection' field
                            .exec();

                        this.publicFeedsGateway.emitRecentActivities(data);
                        console.log('Activity created:', activity);
                    })
                    .catch((error) => {
                        console.error('Error creating activity:', error);
                    });
            } else {
                console.log('This activity already exists.');
            }

            if (wallet?.userId) {
                this.scoresService.createScore(wallet.userId, 'bid');
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

            let owner = null;
            if (ownerWallet.userId) {
                owner = await this.userModel.findOne({
                    _id: ownerWallet.userId
                });
            }

            let to_id = null;
            if (data.criteria.kind == 'token') {
                const tokenInfo = await this.getTokenById(
                    data.contract,
                    data.criteria?.data?.token?.tokenId
                );
                console.log(
                    'tokenInfo',
                    data.contract,
                    data.criteria?.data?.token?.tokenId
                );
                console.log('tokenInfo', tokenInfo);
                if (
                    tokenInfo &&
                    tokenInfo.tokens[0] &&
                    tokenInfo.tokens[0].token &&
                    tokenInfo.tokens[0].token.owner
                ) {
                    const api_owner_wallet_address =
                        tokenInfo.tokens[0].token.owner;
                    ownerWallet = await this.walletModel.findOne({
                        address: {
                            $regex: new RegExp(
                                `^${api_owner_wallet_address}$`,
                                'i'
                            )
                        }
                    });
                    if (ownerWallet && ownerWallet.userId) {
                        to_id = ownerWallet.userId.toString();
                        owner = await this.userModel.findOne({
                            _id: ownerWallet.userId
                        });
                    }
                }
                console.log('tokenInfo', to_id);
            } else if (data.criteria.kind == 'collection') {
                to_id = ownerWallet.userId.toString();
            }

            console.log('to_id', to_id);
            if (to_id) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const dataPost: any = {
                    to_id: to_id,
                    send_by: wallet?.userId,
                    data: {
                        type:
                            data.criteria.kind == 'token'
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

    async getTokenById(collection: string, tokenId: string) {
        try {
            const url = `https://api-arbitrum.reservoir.tools/tokens/v6?tokens=${collection}:${tokenId}`;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { status, data } = await axios.get<any>(url, {
                headers: {
                    'x-auth-token': process.env.RESERVOIR_API_KEY
                }
            });
            return status == 200 ? data : null;
        } catch (error) {
            console.log('sendMessageError', error);
            return null;
        }
    }
}
