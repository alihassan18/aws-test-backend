import {
    Inject,
    forwardRef,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import {
    CollectionFilterInput,
    CollectionResponse,
    CreateCollectionInput
} from './dto/create-collection.input';
import { UpdateCollectionInput } from './dto/update-collection.input';
import { InjectModel } from '@nestjs/mongoose';
import {
    Collection,
    CollectionDocument,
    CollectionToken
} from './entities/collection.entity';
import { FilterQuery, Model, Types } from 'mongoose';
import { env } from 'process';
import {
    CommonAssetResponse,
    CommonTransactionResponse,
    QueryCollectionTradeResponse
} from 'nftscan-api/dist/src/types/evm';
import { COLLECTIONS } from 'src/constants/db.collections';
import {
    ListingResults,
    ReservoirService,
    SearchCollectionResults,
    chains
} from '../shared/services/reservoir.service';
import * as ethers from 'ethers';
import { /* ErcType, */ EvmChain, NftscanEvm, RangeType } from 'nftscan-api';
import {
    TradeDistribution,
    TradeDistributionDocument
} from './entities/collection.trade.entity';
import {
    Distributions,
    DistributionsDocument
} from './entities/collection.distributions';
// import * as moment from 'moment';
import { Listing, ListingDocument } from '../listings/entities/listing.entity';
import { Bid, BidDocument } from '../bids/entities/bid.entity';
import { History, HistoryDocument } from '../history/entities/history.entity';
import { Nft, NftDocument } from '../nfts/entities/nft.entity';
import { User, UserDocument } from '../users/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PipelineStage } from 'mongoose';
import { PublicCollectionGateway } from '../gateways/public/public-collection.gateway';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { Post, PostDocument } from '../feeds/entities/post.entity';
import { generateOGImage } from 'src/helpers/linkPreviews';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sdk = require('api')('@reservoirprotocol/v3.0#a9z3kf2slk1c8pg1');

@Injectable()
export class CollectionsService {
    constructor(
        @InjectModel(COLLECTIONS)
        private collectionModel: Model<CollectionDocument>,
        @InjectModel(Post.name) private postModel: Model<PostDocument>,
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        @InjectModel(Nft.name)
        private nftModel: Model<NftDocument>,
        @InjectModel(TradeDistribution.name)
        private tradeModel: Model<TradeDistributionDocument>,
        @InjectModel(Distributions.name)
        private distributionModel: Model<DistributionsDocument>,
        @InjectModel(Listing.name)
        private listingModel: Model<ListingDocument>,
        @InjectModel(History.name)
        private historyModel: Model<HistoryDocument>,
        @InjectModel(Bid.name)
        private bidModel: Model<BidDocument>,
        private reservoirService: ReservoirService,
        private eventEmitter: EventEmitter2,
        private readonly redisPubSubService: RedisPubSubService,
        @Inject(forwardRef(() => PublicCollectionGateway))
        private publicCollectionGateway: PublicCollectionGateway // @InjectModel(Notification.name) // private readonly notificationModel: Model<NotificationDocument>
    ) {
        this.collectionModel.watch().on('change', (data) => {
            if (
                data.operationType === 'update' &&
                !data?.updateDescription?.updatedFields?.tokens_fetched_count &&
                !(
                    Object.keys(data?.updateDescription?.updatedFields)
                        .length === 1 &&
                    Object.keys(data?.updateDescription?.updatedFields)[0] ==
                        'updatedAt'
                )
            ) {
                const collection: Partial<CollectionDocument> = {
                    _id: data.documentKey?._id,
                    ...data?.updateDescription?.updatedFields
                };
                // Emit a socket event when an update occurs
                this.publicCollectionGateway.emitColletionData(collection);
            }
        });
        // this.startCollectionsJobManually();
    }

    async findById(id: string | Types.ObjectId): Promise<Collection> {
        return this.collectionModel.findById(id).exec();
    }

    async getMostViewed() {
        try {
            return await this.collectionModel
                .find()
                .sort({ collectionViews: -1 })
                .limit(30);
        } catch (error) {
            console.log('Error:', error);
        }
    }

    create(
        createCollectionInput: CreateCollectionInput,
        creator: Types.ObjectId
    ): Promise<Collection> {
        return this.collectionModel.create({
            ...createCollectionInput,
            creator
        });
    }

    // async findAll(
    //     query: FilterQuery<CollectionFilterInput>,
    //     limit: number,
    //     cursor?: string
    // ): Promise<CollectionResponse> {
    //     try {
    //         let updatedQuery = {};
    //         updatedQuery = {
    //             ...(cursor && {
    //                 _id: {
    //                     $gt: new Types.ObjectId(cursor) // Fetch documents with _id greater than the provided cursor
    //                 }
    //             }),
    //             ...(query?.chain && {
    //                 chain: {
    //                     $in: query.chain
    //                 }
    //             }),
    //             ...(query?.creator && {
    //                 creator: new Types.ObjectId(query?.creator)
    //             }),
    //             ...(query?.creators && {
    //                 creator: {
    //                     $in: query.creators.map(
    //                         (item) => new Types.ObjectId(item)
    //                     )
    //                 }
    //             }),
    //             ...(query?.owner && {
    //                 owner: { $regex: new RegExp(`^${query?.owner}$`, 'i') }
    //             }),
    //             ...(query?.follower && {
    //                 followers: { $in: [new Types.ObjectId(query?.follower)] }
    //             }),
    //             ...(query?.is_content_creator !== undefined
    //                 ? { is_content_creator: query?.is_content_creator }
    //                 : {}),
    //             ...(query?.is_metaverse !== undefined
    //                 ? { erc_type: 'erc1155' }
    //                 : {}),
    //             ...(query?.is_auto_auction !== undefined
    //                 ? { is_auto_auction: query?.is_auto_auction }
    //                 : {})
    //         };

    //         const sort = {
    //             ...(query?.sort
    //                 ? {
    //                       //   _id: -1,
    //                       [query?.sort?.type]: query?.sort?.value
    //                   }
    //                 : { createdAt: 1 })
    //         };

    //         const collections = await this.collectionModel
    //             .find(updatedQuery)
    //             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //             // @ts-ignore
    //             .sort(sort)
    //             .limit(limit + 1)
    //             .exec();

    //         const hasNextPage = collections.length > limit;
    //         const edges = hasNextPage ? collections.slice(0, -1) : collections;
    //         const endCursor = hasNextPage
    //             ? edges[edges.length - 1]._id.toString()
    //             : null;

    //         return {
    //             records: edges,
    //             pageInfo: {
    //                 hasNextPage,
    //                 endCursor
    //             }
    //         };
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    async findAll(
        query: FilterQuery<CollectionFilterInput>,
        page: number,
        pageSize: number
    ): Promise<CollectionResponse> {
        try {
            const skip = (page - 1) * pageSize;

            const updatedQuery = {
                ...(query?.chain && {
                    chain: {
                        $in: query.chain
                    }
                }),
                ...(query?.chain && {
                    chain: {
                        $in: query.chain
                    }
                }),
                ...(query?.creator && {
                    creator: new Types.ObjectId(query?.creator)
                }),
                ...(query?.creators && {
                    creator: {
                        $in: query.creators.map(
                            (item) => new Types.ObjectId(item)
                        )
                    }
                }),
                ...(query?.owner && {
                    owner: { $regex: new RegExp(`^${query?.owner}$`, 'i') }
                }),
                ...(query?.follower && {
                    followers: { $in: [new Types.ObjectId(query?.follower)] }
                }),
                ...(query?.is_content_creator !== undefined
                    ? { is_content_creator: query?.is_content_creator }
                    : {}),
                ...(query?.is_metaverse !== undefined
                    ? {
                          //   erc_type: 'erc1155',
                          contract: {
                              $in: [
                                  '0xc84725650aacc53fb88a8c618d3d9f6481af1e88',
                                  '0xce44172f6b61fb97f6b5ba5c6163908f0fb60729',
                                  '0x208713c2c94d56b6e1a5781bb851de2eb78f0a9a',
                                  '0x81fea6a299fba9742ebcd6ad4de7361f92391abb',
                                  '0xc4ee3ff221ad2566f30f75087fb519fa740ce7fe',
                                  '0xf97199f79ca6677c3baa20a48320029ba9264b08'
                              ]
                          }
                      }
                    : {}),
                ...(query?.is_auto_auction !== undefined
                    ? { is_auto_auction: query?.is_auto_auction }
                    : {})
            };

            const sort = {
                ...(query?.sort
                    ? {
                          //   _id: -1,
                          [query?.sort?.type]: query?.sort?.value
                      }
                    : { createdAt: 1 })
            };

            const collections = await this.collectionModel
                .find(updatedQuery)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                .sort(sort)
                .skip(skip) // Skip the specified number of documents
                .limit(pageSize) // Limit the number of documents returned
                .exec();

            const totalRecords = await this.collectionModel
                .countDocuments(updatedQuery)
                .exec();

            const hasNextPage = page * pageSize < totalRecords;
            const nextPage = hasNextPage ? page + 1 : null;
            // const totalPages = Math.ceil(totalRecords / pageSize);

            return {
                records: collections,
                pageInfo: {
                    hasNextPage,
                    totalCount: totalRecords,
                    nextPage
                    // totalPages
                }
            };
        } catch (error) {
            console.log(error);
        }
    }

    async createHoldingAmountDistribution(address: string, chain: string) {
        try {
            const config = {
                apiKey: process.env.NFT_SCAN_API_KEY, // Replace with your NFTScan API key.
                chain: chains[chain]?.nftscan || EvmChain.ETH // Replace with your chain.
            };

            const evm = new NftscanEvm(config);
            const holdingAmountDistribution =
                await evm.statistic.getCollectionHoldingAmountDistribution(
                    address
                );
            const holdinggPeriodDistribution =
                await evm.statistic.getCollectionHoldingPeriodDistribution(
                    address
                );

            const t = await this.distributionModel.create({
                contract: address,
                amount: holdingAmountDistribution,
                period: holdinggPeriodDistribution
            });
            console.log(t);
        } catch (error) {
            console.log(error);
        }
    }

    async createCollectionTrades(address: string, chain: string) {
        try {
            const config = {
                apiKey: process.env.NFT_SCAN_API_KEY, // Replace with your NFTScan API key.
                chain: chains[chain]?.nftscan || EvmChain.ETH // Replace with your chain.
            };

            const evm = new NftscanEvm(config);
            const trades = [];
            const trade = await evm.statistic.getCollectionTrade(
                address,
                RangeType.D30
            );
            if (trade.length > 0) {
                trade.forEach((item) => {
                    const element = {
                        contract: address,
                        ...item
                    };
                    trades.push(element);
                });
            }
            const t = await this.tradeModel.insertMany(trades);
            console.log(t);
        } catch (error) {
            console.log(error);
        }
    }

    async createListings(address: string, chain: string) {
        try {
            sdk.auth(process.env.RESERVOIR_API_KEY);
            sdk.server(chains[chain || 'ethereum'].reservoirBaseUrl);
            const listings = await this.reservoirService
                .getListings(address)
                .then()
                .catch();

            await this.listingModel.insertMany(listings.orders);
        } catch (error) {
            console.log('Listing Error:', error);
        }
    }

    async createBids(address: string, chain: string) {
        try {
            sdk.auth(process.env.RESERVOIR_API_KEY);
            sdk.server(chains[chain || 'ethereum'].reservoirBaseUrl);
            const bids = await this.reservoirService
                .getBids(address)
                .then()
                .catch();
            await this.bidModel.insertMany(bids.orders);
        } catch (error) {
            console.log('Bid Error:', error);
        }
    }
    async createActivities(address: string, chain: string) {
        try {
            sdk.auth(process.env.RESERVOIR_API_KEY);
            sdk.server(chains[chain || 'ethereum'].reservoirBaseUrl);
            const history = await this.reservoirService
                .getHistory(address)
                .then()
                .catch();
            const activities = history?.activities?.map((item) => ({
                ...item,
                _collection: item?.collection
            }));
            await this.historyModel.insertMany(activities);
        } catch (error) {
            console.log('History Error', error);
        }
    }

    startTradeEvents(address: string, chain: string): boolean {
        this.redisPubSubService.publish('collection.create.trades', {
            contract: address,
            chain
        });
        this.redisPubSubService.publish('collection.create.amount', {
            contract: address,
            chain
        });
        return true;
    }

    startBidsEvents(address: string, chain: string) {
        this.redisPubSubService.publish('collection.create.bids', {
            contract: address,
            chain
        });
        return true;
    }

    startHistoryEvents(address: string, chain: string) {
        this.redisPubSubService.publish('collection.create.history', {
            contract: address,
            chain
        });
        return true;
    }

    startListingEvents(address: string, chain: string) {
        this.redisPubSubService.publish('collection.create.listings', {
            contract: address,
            chain
        });
        return true;
    }

    startTokenEvents(address: string, chain: string) {
        this.redisPubSubService.publish('collection.create.tokens', {
            contract: address,
            chain
        });
        return true;
    }

    async startCollectionEvents(address: string, chain: string) {
        this.redisPubSubService.publish('collection.create.trades', {
            contract: address,
            chain
        });
        this.redisPubSubService.publish('collection.create.amount', {
            contract: address,
            chain
        });
        this.redisPubSubService.publish('collection.create.bids', {
            contract: address,
            chain
        });
        this.redisPubSubService.publish('collection.create.history', {
            contract: address,
            chain
        });
        this.redisPubSubService.publish('collection.create.tokens', {
            contract: address,
            chain
        });
        this.redisPubSubService.publish('collection.create.listings', {
            contract: address,
            chain
        });
        // this.eventEmitter.emit('collection.create.tokens', {
        //     contract: address,
        //     chain
        // });
        // this.eventEmitter.emit('collection.create.listings', {
        //     contract: address,
        //     chain
        // });
        // this.eventEmitter.emit('collection.create.trades', {
        //     contract: address,
        //     chain
        // });
        // this.eventEmitter.emit('collection.create.amount', {
        //     contract: address,
        //     chain
        // });
        // this.eventEmitter.emit('collection.create.bids', {
        //     contract: address,
        //     chain
        // });
        // this.eventEmitter.emit('collection.create.history', {
        //     contract: address,
        //     chain
        // });
    }

    // async saveOrUpdateCollection(chain: string, address: string) {
    //     const response = await this.reservoirService.getCollection({
    //         chain,
    //         contract: address
    //     });
    //     const collection = response?.collections[0];

    //     const config = {
    //         apiKey: process.env.NFT_SCAN_API_KEY, // Replace with your NFTScan API key.
    //         chain: chains[chain]?.nftscan || EvmChain.ETH // Replace with your chain.
    //     };

    //     const evm = new NftscanEvm(config);

    //     const nftscanCollection = await evm.collection.getCollectionsByContract(
    //         address
    //     );

    //     /* If the collection found on the reservoir */
    //     if (collection) {
    //         try {
    //             /* Here we are fetching the stats and saving into database */
    //             const statistic = await evm.statistic.getCollectionStatistics(
    //                 address
    //             );

    //             const saved = await this.collectionModel
    //                 .findOneAndUpdate(
    //                     { contract: address },
    //                     {
    //                         is_fetched: true,
    //                         name: collection?.name || nftscanCollection?.name,
    //                         description:
    //                             collection?.description ||
    //                             nftscanCollection?.description,
    //                         image:
    //                             collection?.image ||
    //                             nftscanCollection?.image,
    //                         chain: chain,
    //                         chainId: chains[chain || 'ethereum'].id,
    //                         contract: collection?.id || address,
    //                         contract_name:
    //                             collection?.name || nftscanCollection?.name,
    //                         banner:
    //                             collection?.banner ||
    //                             nftscanCollection?.banner,
    //                         external_url:
    //                             collection?.externalUrl ||
    //                             nftscanCollection?.website,
    //                         sample_images: collection?.sampleImages,
    //                         token_count:
    //                             collection?.tokenCount ||
    //                             nftscanCollection?.amounts_total,
    //                         supply: nftscanCollection?.items_total,
    //                         is_auto_auction: collection?.collectionBidSupported,
    //                         owners_total:
    //                             collection?.ownerCount ||
    //                             nftscanCollection?.owners_total,
    //                         owner: nftscanCollection?.owner,

    //                         twitter:
    //                             collection?.twitterUsername ||
    //                             nftscanCollection?.twitter,
    //                         discord:
    //                             collection?.discordUrl ||
    //                             nftscanCollection?.discord,
    //                         website: nftscanCollection?.website,
    //                         email: nftscanCollection?.email,
    //                         telegram: nftscanCollection?.telegram,
    //                         github: nftscanCollection?.github,
    //                         instagram: nftscanCollection?.instagram,
    //                         medium: nftscanCollection?.medium,
    //                         average_price_change_1d:
    //                             statistic?.average_price_change_1d,
    //                         sales_1d:
    //                             collection?.salesCount?.['1day'] ||
    //                             statistic?.sales_24h,
    //                         sales_7d: collection?.salesCount?.['7day'],
    //                         sales_30d: collection?.salesCount?.['30day'],
    //                         sales_total:
    //                             collection?.salesCount?.allTime ||
    //                             statistic?.sales,
    //                         volume_1d:
    //                             collection?.volume?.['1day'] ||
    //                             statistic?.volume_1d,
    //                         volume_7d:
    //                             collection?.volume?.['7day'] ||
    //                             statistic?.volume_7d,
    //                         volume_30d:
    //                             collection?.volume?.['30day'] ||
    //                             statistic?.volume_30d,
    //                         volume_total:
    //                             collection?.volume?.allTime ||
    //                             statistic?.total_volume,
    //                         createdAt: collection?.createdAt,
    //                         volume_change_1d:
    //                             collection?.volumeChange?.['1day'],
    //                         // ||statistic?.volume_change_1d,
    //                         volume_change_7d:
    //                             collection?.volumeChange?.['7day'],
    //                         // || statistic?.volume_change_7d,
    //                         market_cap: statistic?.market_cap,
    //                         symbol: collection?.floorAsk?.price?.currency
    //                             ?.symbol,
    //                         floor_price:
    //                             collection?.floorAsk?.price?.amount?.native ||
    //                             nftscanCollection?.floor_price,
    //                         highest_price: statistic?.highest_price,
    //                         erc_type: collection?.contractKind,
    //                         opensea_verified:
    //                             collection?.openseaVerificationStatus ===
    //                             'verified',
    //                         royalty:
    //                             collection?.royalties.bps / 100 ||
    //                             nftscanCollection?.royalty
    //                     },
    //                     { upsert: true, new: true }
    //                 )
    //                 .exec();

    //             return saved;
    //         } catch (error) {
    //             console.log('Collection save error:', error);
    //         }
    //     } else {
    //         /* If the collection not found in the reservoir */
    //         return null;
    //     }
    // }

    async saveOrUpdateCollection(
        chain: string,
        address: string,
        callEvents?: boolean
    ) {
        const collectionData: Partial<CollectionDocument> = {}; // Initialize an empty object to hold the collection data

        try {
            const reservoirResponse = await this.reservoirService.getCollection(
                {
                    chain,
                    contract: address
                }
            );
            const collection = reservoirResponse?.collections[0];

            // Merge the data from the reservoir API into the collectionData object
            if (collection) {
                collectionData.image = collection.image;
                collectionData.chain = chain;
                collectionData.chainId = chains[chain || 'ethereum'].id;
                collectionData.contract = collection?.id;
                collectionData.contract_name = collection?.name;
                collectionData.banner = collection?.banner;
                collectionData.external_url = collection?.externalUrl;
                collectionData.sample_images = collection?.sampleImages;
                collectionData.token_count = Number(collection?.tokenCount);
                collectionData.is_auto_auction =
                    collection?.collectionBidSupported;
                collectionData.owners_total = collection?.ownerCount;
                collectionData.twitter = collection?.twitterUsername;
                collectionData.sales_7d = collection?.salesCount?.['7day'];
                collectionData.sales_30d = collection?.salesCount?.['30day'];
                collectionData.volume_1d = collection?.volume?.['1day'];
                collectionData.volume_7d = collection?.volume?.['7day'];
                collectionData.volume_30d = collection?.volume?.['30day'];
                collectionData.volume_total = collection?.volume?.allTime;
                // collectionData.createdAt = collection?.createdAt;
                collectionData.volume_change_1d =
                    collection?.volumeChange?.['1day'];

                collectionData.volume_change_7d =
                    collection?.volumeChange?.['7day'];
                collectionData.symbol =
                    collection?.floorAsk?.price?.currency?.symbol;
                collectionData.floor_price =
                    collection?.floorAsk?.price?.amount?.native;
                collectionData.erc_type = collection?.contractKind;

                collectionData.opensea_verified =
                    collection?.openseaVerificationStatus === 'verified';

                collectionData.royalty = collection?.royalties.bps / 100;
            }
        } catch (error) {
            console.log('Reservoir API call error:', error);
        }

        const config = {
            apiKey: process.env.NFT_SCAN_API_KEY, // Replace with your NFTScan API key.
            chain: chains[chain]?.nftscan || EvmChain.ETH // Replace with your chain.
        };

        const evm = new NftscanEvm(config);

        try {
            const nftscanCollection =
                await evm.collection.getCollectionsByContract(address);
            collectionData.name =
                nftscanCollection?.name ?? collectionData.name;
            collectionData.description =
                nftscanCollection?.description ?? collectionData.description;
            collectionData.image =
                nftscanCollection?.logo_url ?? collectionData?.image;
            collectionData.external_url =
                nftscanCollection?.website ?? collectionData.external_url;
            collectionData.token_count =
                nftscanCollection?.amounts_total ?? collectionData.token_count;
            collectionData.supply =
                nftscanCollection?.items_total ?? collectionData.supply;

            collectionData.owners_total =
                nftscanCollection?.owners_total ?? collectionData.owners_total;
            collectionData.owner =
                nftscanCollection?.owner ?? collectionData.owner;
            collectionData.twitter =
                nftscanCollection?.twitter ?? collectionData.twitter;

            collectionData.discord =
                nftscanCollection?.discord ?? collectionData.discord;
            collectionData.website =
                nftscanCollection?.website ?? collectionData.website;
            collectionData.email =
                nftscanCollection?.email ?? collectionData.email;
            collectionData.telegram =
                nftscanCollection?.telegram ?? collectionData.telegram;
            collectionData.github =
                nftscanCollection?.github ?? collectionData.github;
            collectionData.instagram =
                nftscanCollection?.instagram ?? collectionData.instagram;
            collectionData.medium =
                nftscanCollection?.medium ?? collectionData.medium;
            collectionData.floor_price =
                nftscanCollection?.floor_price ?? collectionData.floor_price;
            collectionData.royalty = nftscanCollection?.royalty
                ? nftscanCollection.royalty / 100
                : collectionData.royalty;
        } catch (error) {
            console.log('Nftscan SDK API call error:', error);
        }

        // Here we are fetching the stats and saving into the database
        try {
            const statistic = await evm.statistic.getCollectionStatistics(
                address
            );

            // Merge the data from the statistics into the collectionData object
            collectionData.average_price_change_1d =
                statistic?.average_price_change_1d ??
                statistic.average_price_change_1d;
            collectionData.sales_1d =
                statistic?.sales_24h ?? statistic.sales_24h;

            collectionData.average_price_change_1d =
                statistic?.average_price_change_1d ??
                statistic?.average_price_change_1d;

            collectionData.sales_1d =
                statistic?.sales_24h ?? statistic?.sales_24h;

            collectionData.sales_total = statistic?.sales ?? statistic?.sales;

            collectionData.volume_1d =
                statistic?.volume_1d ?? statistic?.volume_1d;

            collectionData.volume_7d =
                statistic?.volume_7d ?? statistic?.volume_7d;

            collectionData.volume_30d =
                statistic?.volume_30d ?? statistic?.volume_30d;

            collectionData.volume_total =
                statistic?.total_volume ?? statistic?.total_volume;

            collectionData.market_cap =
                statistic?.market_cap ?? statistic?.market_cap;

            collectionData.highest_price =
                statistic?.highest_price ?? statistic?.highest_price;

            const saved = await this.collectionModel
                .findOneAndUpdate(
                    { contract: address, chain: chain },
                    {
                        ...collectionData,
                        chain: chain,
                        chainId: chains[chain || 'ethereum'].id,
                        is_fetched: true
                        // ... (add other properties accordingly)
                    },
                    { upsert: true, new: true }
                )
                .exec();
            if (callEvents) {
                this.startCollectionEvents(address, chain);
            }

            return saved;
        } catch (error) {
            console.log('Collection save error:', error);
            return null;
        }
    }

    async findByAddressAndChain(
        address: string,
        chain: string
    ): Promise<CollectionDocument> {
        const collection = await this.collectionModel
            .findOne({
                chain,
                contract: { $regex: new RegExp(`^${address}$`, 'i') }
            })
            .exec();

        if (!collection) {
            return this.saveOrUpdateCollection(chain, address, true);
        } else {
            if (!collection?.is_all_tokens_fetched) {
                this.redisPubSubService.publish('collection.create.tokens', {
                    contract: address,
                    chain
                });
            }
            if (!collection?.is_all_listings_fetched) {
                this.redisPubSubService.publish('collection.create.listings', {
                    contract: address,
                    chain
                });
            }
            this.redisPubSubService.publish('collection.create.trades', {
                contract: address,
                chain
            });
            this.redisPubSubService.publish('collection.create.amount', {
                contract: address,
                chain
            });
            this.redisPubSubService.publish('collection.create.bids', {
                contract: address,
                chain
            });
            this.redisPubSubService.publish('collection.create.history', {
                contract: address,
                chain
            });
            // this.startCollectionEvents(address, chain);
            if (!collection?.is_fetched) {
                const c = await this.saveOrUpdateCollection(chain, address);
                if (c) {
                    return c;
                } else {
                    return collection;
                }
            }
            return collection;
        }
    }

    async getLinkPreview(
        address: string,
        chain: string
    ): Promise<{ link_preview: string }> {
        const collection = await this.collectionModel
            .findOne({
                chain,
                contract: { $regex: new RegExp(`^${address}$`, 'i') }
            })
            .exec();

        let post = null;
        if (collection?.post) {
            post = await this.postModel
                .findById(collection.post)
                .select('commentsCount repostCount reactions');
        }

        const requiredObj =
            post && post?.reactions?.find((x) => x.emoji === 'like');
        const likeCounts = requiredObj ? requiredObj?.count : 0;
        const preview = await generateOGImage(
            'collection',
            collection?.name,
            collection?.banner || '',
            collection?.description,
            collection?.symbol,
            collection?.floor_price,
            collection?.volume_total,
            post?.commentsCount || 0,
            post?.repostCount || 0,
            likeCounts,
            collection?.collectionViews || 0
        );
        return { link_preview: preview || '' };
    }

    async createToken(
        data: CollectionToken,
        contract: string
    ): Promise<CollectionDocument> {
        const collection = await this.collectionModel
            .findOne({
                contract: contract
            })
            .exec();
        if (!collection) {
            throw NotFoundException;
        }
        collection.tokens.push(data);
        await collection.save();
        return collection;
    }

    // async getCollectionListings(address: string, chain: string): Promise<any> {
    //     try {
    //         let result = await this.nftListingRepo
    //             .find({ chain, nft_address: address })
    //             .limit(14);
    //         if (!result) {
    //             return null;
    //         }
    //         result = result ? result : [];
    //         const listings = [];
    //         const arr = [];
    //         for (let i = 0; i < result.length; i++) {
    //             const tokenInfo = this.tokenRepo.findOne({
    //                 chain,
    //                 contract: address,
    //                 token_id: result[i]?.token_ids
    //             });
    //             arr.push(tokenInfo);
    //             // listings.push({ ...tokenInfo['_doc'], listing: result[i] });
    //         }
    //         const tokens = await Promise.all(arr);

    //         for (const iterator of result) {
    //             let i = 0;
    //             tokens[i] &&
    //                 listings.push({ ...tokens[i]['_doc'], listing: iterator });
    //             i++;
    //         }
    //         // console.log(tokens);

    //         // console.log(listings);
    //         // res.json({ data: listings });

    //         return { data: listings };
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // async getOffers(address: string, chain: string) {
    //     try {
    //         let result = null;

    //         const idx = chain_infos.findIndex((item) => item.chain == chain);
    //         var myHeaders = new Headers();
    //         myHeaders.append('X-API-KEY', 'LeT09KwTo6tbskrQoYDwOoMR');

    //         const requestOptions: any = {
    //             method: 'GET',
    //             headers: myHeaders,
    //             redirect: 'follow'
    //         };

    //         const response: any = await fetch(
    //             `${chain_infos[idx].api_url}/api/v2/marketplace/orders?side=sell&nft_address=${address}&token_type=single&sort_field=price&sort_direction=asc`,
    //             requestOptions
    //         );
    //         const results = await response?.text();
    //         const data = JSON.parse(results);
    //         result = data?.code === 200 ? data.data.content : [];
    //         result = result ? result : [];

    //         return { data: result };
    //     } catch (error) {
    //         console.log('Error: get offers', error);
    //     }
    // }

    async getHistories(address: string, chain: string) {
        const evmChain =
            chain == 'BSC'
                ? 'BNB'
                : chain == 'ETH'
                ? 'ETH'
                : chain == 'MATIC'
                ? 'POLYGON'
                : chain == 'AVAX'
                ? 'AVALANCHE'
                : 'ETH';

        const config = {
            apiKey: env.NFT_SCAN_API_KEY, // Replace with your NFTScan API key.
            chain: EvmChain[evmChain] // Replace with your chain.
        };

        const evm = new NftscanEvm(config);
        const result: CommonTransactionResponse =
            await evm.transaction.getTransactionsByContract(address);

        const results = result ? result?.content : [];

        return { data: results };
    }

    async tradeDistribution(address: string, chain: string) {
        const evmChain =
            chain == 'BSC'
                ? 'BNB'
                : chain == 'ETH'
                ? 'ETH'
                : chain == 'MATIC'
                ? 'POLYGON'
                : chain == 'AVAX'
                ? 'AVALANCHE'
                : 'ETH';

        const config = {
            apiKey: env.NFT_SCAN_API_KEY, // Replace with your NFTScan API key.
            chain: EvmChain[evmChain] // Replace with your chain.
        };

        const evm = new NftscanEvm(config);
        const results: QueryCollectionTradeResponse[] =
            await evm.statistic.getCollectionTrade(address, RangeType.D1);
        return { data: results };
    }

    // findOne(id:string): Promise<CollectionDocument> {
    //     return this.collectionModel.findById(id);
    // }

    update(
        id: string,
        updateCollectionInput: UpdateCollectionInput
    ): Promise<CollectionDocument> {
        return this.collectionModel.findByIdAndUpdate(
            new Types.ObjectId(id),
            updateCollectionInput,
            { new: true }
        );
    }

    updateTokenCount(
        id: string
        // token_count: number
    ): Promise<CollectionDocument> {
        return this.collectionModel
            .findByIdAndUpdate(
                new Types.ObjectId(id),
                { $inc: { token_count: 1 } }, // Use $inc operator correctly
                { new: true }
            )
            .exec();
    }

    remove(id: number) {
        return `This action removes a #${id} collection`;
    }

    async search(keyword: string) {
        let responses = [];
        const isAddress = ethers.utils.isAddress(keyword as string);
        if (isAddress) {
            const reservoirCollections =
                await this.reservoirService.findByConctractAddress(keyword);

            const collections = await this.collectionModel
                .find({
                    contract: {
                        $regex: new RegExp(`${keyword}`, 'i')
                    }
                })
                .exec();

            // Merge both arrays
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const mergedCollections:
                | CollectionDocument[]
                | SearchCollectionResults[] = [
                ...collections,
                ...reservoirCollections
            ];

            // Use a Map to remove duplicates
            const collectionMap = new Map();
            mergedCollections.forEach((collection) => {
                // For reservoirCollections array items
                if (collection.collectionId) {
                    if (!collectionMap.has(collection.collectionId)) {
                        collectionMap.set(collection.collectionId, {
                            collectionId: collection.collectionId,
                            name: collection.name,
                            slug: collection.slug,
                            contract: collection.contract,
                            allTimeVolume: collection.allTimeVolume,
                            openseaVerificationStatus:
                                collection.openseaVerificationStatus,
                            chainName: collection.chainName,
                            chainId: collection.chainId,
                            lightChainIcon: collection.lightChainIcon,
                            darkChainIcon: collection.darkChainIcon
                        });
                    }
                }
                // For collections array items
                else {
                    if (!collectionMap.has(collection.contract)) {
                        collectionMap.set(collection.contract, {
                            collectionId: collection.contract,
                            name: collection.name,
                            slug: collection.contract_name,
                            contract: collection.contract,
                            allTimeVolume: collection.volume_total,
                            openseaVerificationStatus:
                                collection.opensea_verified,
                            chainName: collection.chain,
                            chainId: collection.chainId,
                            lightChainIcon: null, // I don't see a corresponding property in this array
                            darkChainIcon: null // I don't see a corresponding property in this array
                        });
                    }
                }
            });

            // Convert back to an array
            responses = Array.from(collectionMap.values());
        } else {
            const reservoirCollections =
                await this.reservoirService.getSearchCollections({
                    name: keyword
                });
            const collections = await this.collectionModel
                .find({
                    name: { $regex: keyword, $options: 'i' }
                })
                .limit(5)
                .exec();

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const mergedCollections:
                | CollectionDocument[]
                | SearchCollectionResults[] = [
                ...collections,
                ...reservoirCollections
            ];

            // Use a Map to remove duplicates
            const collectionMap = new Map();
            mergedCollections.forEach((collection) => {
                // For reservoirCollections array items
                if (collection.collectionId) {
                    if (!collectionMap.has(collection.collectionId)) {
                        collectionMap.set(collection.collectionId, {
                            collectionId: collection.collectionId,
                            image: collection.image,
                            name: collection.name,
                            slug: collection.slug,
                            contract: collection.contract,
                            allTimeVolume: collection.allTimeVolume,
                            openseaVerificationStatus:
                                collection.openseaVerificationStatus,
                            chainName: collection.chainName,
                            chainId: collection.chainId,
                            lightChainIcon: collection.lightChainIcon,
                            darkChainIcon: collection.darkChainIcon
                        });
                    }
                }
                // For collections array items
                else {
                    if (!collectionMap.has(collection.contract)) {
                        collectionMap.set(collection.contract, {
                            collectionId: collection.contract,
                            tokenCount: collection.token_count,
                            name: collection.name,
                            image: collection.image,
                            slug: collection.contract_name,
                            contract: collection.contract,
                            allTimeVolume: collection.volume_total,
                            openseaVerificationStatus:
                                collection.opensea_verified,
                            chainName: collection.chain,
                            chainId: collection.chainId,
                            lightChainIcon: null, // I don't see a corresponding property in this array
                            darkChainIcon: null // I don't see a corresponding property in this array
                        });
                    }
                }
            });

            // Convert back to an array
            responses = Array.from(collectionMap.values());
            // console.log(responses);
        }
        return responses;
        // this.getSearchCollections({ name: keyword });
    }

    async toggleFollowCollection(
        userId: Types.ObjectId,
        collectionId: string
    ): Promise<CollectionDocument> {
        console.log('call');
        try {
            const collection = await this.collectionModel
                .findById(collectionId)
                .exec();

            const user = await this.userModel
                .findById(userId)
                .select('-followingTimestamps -followersTimestamps')
                .exec();
            //delete user.followingTimestamps;
            //delete user.followersTimestamps;

            console.log('user', user);
            const index = collection.followers.findIndex(
                (id) => id.toString() === userId.toString()
            );

            if (index === -1) {
                user.followingCollections.push(
                    new Types.ObjectId(collectionId)
                );
                collection.followers.push(userId);
                collection.followersCount++;
            } else {
                const i = user.followingCollections.findIndex(
                    (id) => id.toString() === userId.toString()
                );
                user.followingCollections.splice(i, 1);

                collection.followers.splice(index, 1);
                collection.followersCount--;
            }

            await user.save();

            return this.collectionModel
                .findOneAndUpdate(
                    { _id: collectionId },
                    {
                        followers: collection.followers,
                        followersCount: collection.followersCount
                    },
                    { new: true }
                )
                .exec();
        } catch (error) {
            console.log('error', error);
        }
    }

    async findTradeDistribution(
        contract: string,
        chain: string,
        filter: string
    ): Promise<TradeDistribution[]> {
        const config = {
            apiKey: process.env.NFT_SCAN_API_KEY, // Replace with your NFTScan API key.
            chain: chains[chain]?.nftscan || EvmChain.ETH // Replace with your chain.
        };

        const evm = new NftscanEvm(config);
        const trades = [];

        let filterDate;
        switch (filter) {
            case '1d':
                filterDate = RangeType.D1;
                break;
            case '7d':
                filterDate = RangeType.D7;
                break;
            case '1m':
                filterDate = RangeType.D30;
                break;
            case '3m':
                filterDate = RangeType.MTH3;
                break;
            case '1y':
                filterDate = RangeType.Y1;
                break;
            case 'All':
                filterDate = RangeType.ALL;
                break;
            default:
                filterDate = RangeType.D30;
        }
        const trade = await evm.statistic.getCollectionTrade(
            contract,
            filterDate
        );
        if (trade.length > 0) {
            trade.forEach((item) => {
                const element = {
                    contract: contract,
                    ...item
                };
                trades.push(element);
            });
        }
        return trades;
        // let filterDate;
        // switch (filter) {
        //     case '1d':
        //         filterDate = moment().subtract(1, 'days').valueOf();
        //         break;
        //     case '7d':
        //         filterDate = moment().subtract(7, 'days').valueOf();
        //         break;
        //     case '1m':
        //         filterDate = moment().subtract(1, 'months').valueOf();
        //         break;
        //     case '3m':
        //         filterDate = moment().subtract(3, 'months').valueOf();
        //         break;
        //     case '1y':
        //         filterDate = moment().subtract(1, 'years').valueOf();
        //         break;
        //     case 'All':
        //         filterDate = 0;
        //         break;
        //     default:
        //         filterDate = moment().valueOf(); // fallback to current date
        // }

        // return this.tradeModel
        //     .find({
        //         contract,
        //         timestamp: {
        //             $gte: filterDate / 1000
        //         }
        //     })
        //     .exec();
    }

    async findDistributions(
        contract: string,
        chain: string
    ): Promise<Partial<DistributionsDocument>> {
        const config = {
            apiKey: process.env.NFT_SCAN_API_KEY, // Replace with your NFTScan API key.
            chain: chains[chain]?.nftscan || EvmChain.ETH // Replace with your chain.
        };

        const evm = new NftscanEvm(config);
        const holdingAmountDistribution =
            await evm.statistic.getCollectionHoldingAmountDistribution(
                contract
            );
        const holdinggPeriodDistribution =
            await evm.statistic.getCollectionHoldingPeriodDistribution(
                contract
            );

        const trades = {
            contract: contract,
            amount: holdingAmountDistribution,
            period: holdinggPeriodDistribution
        };
        return trades;
        // return this.distributionModel.findOne({ contract }).exec();
    }

    async fetchAllTokensByCollection(
        contract: string,
        chain: string
    ): Promise<CommonAssetResponse[]> {
        console.log('Fetching tokens process started');

        try {
            const tokens: CommonAssetResponse[] = [];
            let cursor: string | null = null;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line no-constant-condition
            while (true) {
                try {
                    const config = {
                        apiKey: process.env.NFT_SCAN_API_KEY, // Replace with your NFTScan API key.
                        chain: chains[chain]?.nftscan || EvmChain.ETH // Replace with your chain.
                    };
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const evm = new NftscanEvm(config);

                    const response = await evm.asset.getAssetsByContract(
                        contract,
                        {
                            limit: 20,
                            cursor: cursor
                        }
                    );
                    const data = response;
                    tokens.push(data);

                    const newTokens = data?.content?.map((oldToken) => {
                        const newToken = {
                            chain: chain,
                            contract: oldToken.contract_address,
                            contractAddress: oldToken.contract_address,
                            contractName: oldToken.contract_name,
                            contractTokenId: oldToken.contract_token_id,
                            tokenId: oldToken.token_id,
                            ercType: oldToken.erc_type,
                            amount: oldToken.amount,
                            minter: oldToken.minter,
                            owner: oldToken.owner,
                            ownTimestamp: oldToken.own_timestamp,
                            mintTimestamp: oldToken.mint_timestamp,
                            mintTransactionHash: oldToken.mint_transaction_hash,
                            mintPrice: oldToken.mint_price,
                            tokenUri: oldToken.token_uri,
                            metadataJson: oldToken.metadata_json,
                            name: oldToken.name
                                ? oldToken.name
                                : oldToken.contract_name +
                                  '#' +
                                  oldToken.token_id,
                            contentType: oldToken.content_type,
                            contentUri: oldToken.content_uri,
                            description: oldToken.description,
                            imageUri: oldToken.image_uri,
                            image: oldToken.image_uri,
                            externalLink: oldToken.external_link,
                            latestTradePrice: oldToken.latest_trade_price,
                            latestTradeSymbol: oldToken.latest_trade_symbol,
                            latestTradeToken: oldToken.latest_trade_token,
                            latestTradeTimestamp:
                                oldToken.latest_trade_timestamp,
                            nftscanId: oldToken.nftscan_id,
                            nftscanUri: oldToken.nftscan_uri,
                            smallNftscanUri: oldToken.small_nftscan_uri,
                            attributes: oldToken.attributes,
                            rarityScore: oldToken.rarity_score,
                            rarityRank: oldToken.rarity_rank
                        };

                        return newToken;
                    });

                    await this.nftModel.insertMany(newTokens, {
                        ordered: false
                    });

                    const nextPageCursor = response?.next;
                    if (!nextPageCursor) {
                        break;
                    }

                    cursor = nextPageCursor;
                } catch (error) {
                    console.log(error);
                    try {
                        const collection = await this.collectionModel
                            .findOne({
                                contract: {
                                    $regex: new RegExp(`^${contract}$`, 'i')
                                }
                            })
                            .exec();
                        collection.tokens_fetched_count = tokens.length;
                        await collection.save();
                    } catch (error) {
                        console.log(error);
                    }
                }
            }

            const collection = await this.collectionModel
                .findOne({
                    contract: {
                        $regex: new RegExp(`^${contract}$`, 'i')
                    }
                })
                .exec();
            collection.is_all_tokens_fetched = true;
            await collection.save();
            return tokens;
        } catch (error) {
            console.log(error);
        }
    }

    // async fetchAllListingsByCollection(
    //     contract: string,
    //     chain: string,
    //     retryAttempts = 2
    // ): Promise<ListingResults['orders'][]> {
    //     console.log('Fetching listings process started');

    //     let attempt = 0;

    //     while (attempt < retryAttempts) {
    //         try {
    //             const listings: ListingResults['orders'][] = [];
    //             let continuation: string | null = null;
    //             // eslint-disable-next-line no-constant-condition
    //             while (true) {
    //                 try {
    //                     sdk.auth(process.env.RESERVOIR_API_KEY);
    //                     sdk.server(
    //                         chains[chain || 'ethereum'].reservoirBaseUrl
    //                     );

    //                     const data = await sdk.getOrdersAsksV5({
    //                         contracts: contract,
    //                         status: 'active',
    //                         ...(continuation && {
    //                             continuation: continuation
    //                         }),
    //                         limit: '50',
    //                         accept: '*/*'
    //                     });

    //                     const response: ListingResults = data?.data;
    //                     listings.push(response.orders);

    //                     await this.listingModel.insertMany(response?.orders, {
    //                         ordered: false
    //                     });

    //                     const nextPageCursor = response?.continuation;
    //                     if (!nextPageCursor) {
    //                         break;
    //                     }

    //                     continuation = nextPageCursor;
    //                 } catch (error) {
    //                     console.log(error);
    //                     throw error; // Re-throw the error to trigger the retry mechanism
    //                 }
    //             }

    //             const collection = await this.collectionModel
    //                 .findOne({
    //                     contract: {
    //                         $regex: new RegExp(`^${contract}$`, 'i')
    //                     }
    //                 })
    //                 .exec();
    //             collection.is_all_listings_fetched = true;
    //             await collection.save();
    //             return listings;
    //         } catch (error) {
    //             console.log(
    //                 `Attempt ${
    //                     attempt + 1
    //                 } of ${retryAttempts} failed. Retrying...`,
    //                 error
    //             );
    //             attempt++;
    //         }
    //     }

    //     console.log(
    //         `Fetching listings failed after ${retryAttempts} attempts.`
    //     );
    //     return []; // Return an empty array or handle the failure accordingly
    // }

    async fetchAllListingsByCollection(
        contract: string,
        chain: string,
        retryAttempts = 2
    ): Promise<ListingResults['orders'][]> {
        console.log('Fetching listings process started');

        let attempt = 0;

        while (attempt < retryAttempts) {
            try {
                const listings: ListingResults['orders'][] = [];
                let continuation: string | null = null;

                // eslint-disable-next-line no-constant-condition
                while (true) {
                    try {
                        sdk.auth(process.env.RESERVOIR_API_KEY);
                        sdk.server(
                            chains[chain || 'ethereum'].reservoirBaseUrl
                        );
                        const data = await sdk.getOrdersAsksV5({
                            contracts: contract,
                            status: 'active',
                            ...(continuation && {
                                continuation: continuation
                            }),
                            limit: '50',
                            accept: '*/*'
                        });

                        const response: ListingResults = data?.data;
                        listings.push(response.orders);

                        try {
                            await this.listingModel.insertMany(
                                response?.orders,
                                {
                                    ordered: false
                                }
                            );
                        } catch (error) {
                            console.log(
                                `MongoDB duplication error occurred. Continuing with the process...`
                            );
                        }

                        const nextPageCursor = response?.continuation;
                        if (!nextPageCursor) {
                            break;
                        }

                        continuation = nextPageCursor;
                    } catch (error) {
                        if (
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            //@ts-ignore
                            error.code === 11000
                        ) {
                            // Log the error and continue with the process
                            console.log(
                                `MongoDB duplication error occurred. Continuing with the process...`
                            );
                        } else {
                            // If it's not a MongoDB duplication error, re-throw the error to trigger the retry mechanism
                            throw error;
                        }
                    }
                }

                const collection = await this.collectionModel
                    .findOne({
                        contract: {
                            $regex: new RegExp(`^${contract}$`, 'i')
                        }
                    })
                    .exec();
                collection.is_all_listings_fetched = true;
                await collection.save();
                return listings;
            } catch (error) {
                console.log(
                    `Attempt ${
                        attempt + 1
                    } of ${retryAttempts} failed. Retrying...`,
                    error
                );
                attempt++;
            }
        }

        console.log(
            `Fetching listings failed after ${retryAttempts} attempts.`
        );
        return []; // Return an empty array or handle the failure accordingly
    }

    async startCollectionsJobManually() {
        for (const key in chains) {
            if (Object.prototype.hasOwnProperty.call(chains, key)) {
                const element = chains[key];

                await this.reservoirService.insertTopCollections(
                    element?.routePrefix
                );
            }
        }
    }

    async findCollectionsByCreatorName(creatorName?: string): Promise<User[]> {
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    is_content_creator: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'creator',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            }
        ];

        if (creatorName) {
            pipeline.push({
                $match: {
                    'user.userName': {
                        $regex: `^${creatorName}`,
                        $options: 'i'
                    }
                }
            });
        }

        pipeline.push(
            // {
            //     $replaceRoot: {
            //         newRoot: '$user'
            //     }
            // },
            // {
            //     $group: {
            //         _id: '$_id',
            //         user: { $first: '$user' } // Keep the first user document encountered
            //     }
            // },
            {
                $replaceRoot: {
                    newRoot: '$user'
                }
            },
            {
                $limit: 5
            }
        );

        const users = await this.collectionModel.aggregate(pipeline).exec();

        return users;
    }

    async removeCollection(id: Types.ObjectId) {
        await this.collectionModel.findByIdAndUpdate(id, {
            $set: { is_deleted: true }
        });
        return { success: true };
    }

    async updateTimeSpentOnCollection(
        collectionId: Types.ObjectId,
        time: number
    ): Promise<Collection> {
        try {
            const olderThan48Hours = new Date(Date.now() - 48 * 60 * 60 * 1000);
            await this.collectionModel.updateMany(
                {},
                {
                    $pull: {
                        collectionViewsTimestamps: { $lt: olderThan48Hours }
                    }
                }
            );

            const collection = await this.collectionModel
                .findByIdAndUpdate(
                    collectionId,
                    {
                        $inc: {
                            collectionViews: Math.floor(time)
                        },
                        $push: {
                            collectionViewsTimestamps: new Date()
                        }
                    },
                    { new: true }
                )
                .exec();

            if (!collection) {
                throw new Error('collection not found');
            }

            /* Check if collection is binded to post. If yes then update the collection object as well. */
            if (collection?.post) {
                await this.postModel
                    .findByIdAndUpdate(
                        collection?.post,
                        { $inc: { postViews: Math.floor(time) } },
                        { new: true }
                    )
                    .exec();
            }

            this.publicCollectionGateway.emitCollectionViews({
                collectionId: collectionId.toString(),
                collectionViews: collection.collectionViews
            });
            return collection;
        } catch (error) {
            console.error(error);
            // throw error;
        }
    }

    async getMostViewedCollections(): Promise<CollectionDocument[]> {
        try {
            const twentyFourHoursAgo = new Date(
                Date.now() - 24 * 60 * 60 * 1000
            );
            const collections = await this.postModel
                .aggregate([
                    {
                        $match: {
                            $and: [
                                { collectionData: { $ne: null } },
                                { collectionData: { $exists: true } },
                                {
                                    collectionViewsTimestamps: {
                                        $gte: twentyFourHoursAgo
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: 'collections',
                            localField: 'collectionData.contract',
                            foreignField: 'contract',
                            as: 'collectionInfo'
                        }
                    },
                    {
                        $unwind: '$collectionInfo'
                    },
                    {
                        $match: {
                            'collectionInfo.is_content_creator': true // Filter collections with is_content_creator = true
                        }
                    },
                    {
                        $replaceRoot: {
                            newRoot: '$collectionInfo'
                        }
                    },
                    // Check if the "chain" field exists in the input document (collectionData)
                    {
                        $addFields: {
                            hasChain: {
                                $ifNull: ['$collectionData.chain', false]
                            }
                        }
                    },
                    // Check if the "chain" field exists in the "collections" collection
                    {
                        $lookup: {
                            from: 'collections',
                            localField: 'contract',
                            foreignField: 'contract',
                            as: 'chainCollections'
                        }
                    },
                    {
                        $addFields: {
                            hasChainInCollections: {
                                $cond: [
                                    {
                                        $gt: [{ $size: '$chainCollections' }, 0]
                                    },
                                    true,
                                    false
                                ]
                            }
                        }
                    },
                    // Use $or to filter documents based on both conditions
                    {
                        $match: {
                            $or: [
                                { hasChain: true }, // Include documents with "chain" in collectionData
                                { hasChainInCollections: true } // Include documents with "chain" in the "collections" collection
                            ]
                        }
                    },
                    // Group the documents by contract and chain
                    {
                        $group: {
                            _id: {
                                contract: '$contract',
                                chain: '$chain'
                            },
                            doc: { $first: '$$ROOT' }
                        }
                    },
                    // Replace the root with the selected document
                    {
                        $replaceRoot: {
                            newRoot: '$doc'
                        }
                    }
                ])
                .exec();
            return collections;
        } catch (error) {
            console.log(error);
        }
    }
}
