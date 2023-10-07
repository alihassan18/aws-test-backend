import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    ReservoirClient,
    createClient,
    paths
} from '@reservoir0x/reservoir-sdk';
import { Model } from 'mongoose';
import { COLLECTIONS } from 'src/constants/db.collections';
import { CollectionDocument } from 'src/modules/collections/entities/collection.entity';
import { CollectionQueryInput } from 'src/modules/reservoir/dto/reservoir.inputtypes';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const sdk = require('api')('@reservoirprotocol/v3.0#a9z3kf2slk1c8pg1');
import EventEmitter from 'events';
import { SHARED_EMITTER } from 'src/constants/socket.constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
    Listing,
    ListingDocument
} from 'src/modules/listings/entities/listing.entity';
import { Bid, BidDocument } from 'src/modules/bids/entities/bid.entity';

export type SearchCollectionResults =
    paths['/search/collections/v2']['get']['responses']['200']['schema'];
export type ListingResults =
    paths['/orders/asks/v4']['get']['responses']['200']['schema'];
export type BidResults =
    paths['/orders/bids/v5']['get']['responses']['200']['schema'];
type CollectionsResults =
    paths['/collections/v5']['get']['responses']['200']['schema'];
type ActivitiesResults =
    paths['/collections/activity/v5']['get']['responses']['200']['schema'];
type TokensResults = paths['/tokens/v5']['get']['responses']['200']['schema'];

export type SearchCollection = NonNullable<
    paths['/search/collections/v1']['get']['responses']['200']['schema']['collections']
>[0] & {
    chainName: string;
    chainId: number;
    lightChainIcon: string;
    darkChainIcon: string;
    volumeCurrencySymbol: string;
    volumeCurrencyDecimals: number;
    tokenCount: string;
};
// type CollectionQuery = paths['/collections/v5']['get']['parameters']['query'];

export const chains = {
    arbitreum: {
        nftscan: 'eth',
        name: 'Ethereum',
        shortName: 'eth',
        lightIconUrl: '/icons/eth-icon-dark.svg',
        darkIconUrl: '/icons/eth-icon-light.svg',
        reservoirBaseUrl: 'https://api.reservoir.tools',
        proxyApi: '/api/reservoir/arbitreum',
        routePrefix: 'arbitreum',
        apiKey: process.env.POLYGON_RESERVOIR_API_KEY,
        coingeckoId: 'arbitreum-network',
        collectionSetId: process.env.NEXT_PUBLIC_POLYGON_COLLECTION_SET_ID,
        community: process.env.NEXT_PUBLIC_POLYGON_COMMUNITY,
        id: 1
    },
    polygon: {
        nftscan: 'polygon',
        name: 'Polygon',
        lightIconUrl: '/icons/polygon-icon-dark.svg',
        darkIconUrl: '/icons/polygon-icon-light.svg',
        reservoirBaseUrl: 'https://api-polygon.reservoir.tools',
        proxyApi: '/api/reservoir/polygon',
        routePrefix: 'polygon',
        apiKey: process.env.POLYGON_RESERVOIR_API_KEY,
        coingeckoId: 'matic-network',
        collectionSetId: process.env.NEXT_PUBLIC_POLYGON_COLLECTION_SET_ID,
        community: process.env.NEXT_PUBLIC_POLYGON_COMMUNITY,
        id: 137
    },
    bsc: {
        nftscan: 'bnb',
        lightIconUrl: '/icons/bsc-icon-dark.svg',
        darkIconUrl: '/icons/bsc-icon-light.svg',
        reservoirBaseUrl: 'https://api-bsc.reservoir.tools',
        proxyApi: '/api/reservoir/bsc',
        routePrefix: 'bsc',
        id: 56,
        name: 'BNB Smart Chain',
        network: 'bsc',
        nativeCurrency: {
            decimals: 18,
            name: 'BNB',
            symbol: 'BNB'
        },
        rpcUrls: {
            default: {
                http: ['https://rpc.ankr.com/bsc']
            },
            public: {
                http: ['https://rpc.ankr.com/bsc']
            }
        },
        blockExplorers: {
            etherscan: {
                name: 'BscScan',
                url: 'https://bscscan.com'
            },
            default: {
                name: 'BscScan',
                url: 'https://bscscan.com'
            }
        },
        contracts: {
            multicall3: {
                address: '0xca11bde05977b3631167028862be2a173976ca11',
                blockCreated: 15921452
            }
        }
    },

    // arbitrum: {
    //     name: 'Arbitrum',
    //     lightIconUrl: '/icons/arbitrum-icon-dark.svg',
    //     darkIconUrl: '/icons/arbitrum-icon-light.svg',
    //     reservoirBaseUrl: 'https://api-arbitrum.reservoir.tools',
    //     proxyApi: '/api/reservoir/arbitrum',
    //     routePrefix: 'arbitrum',
    //     apiKey: process.env.ARBITRUM_RESERVOIR_API_KEY,
    //     coingeckoId: 'arbitrum-iou',
    //     id: 42161
    // },

    // optimism: {
    //     name: 'Optimism',
    //     lightIconUrl: '/icons/optimism-icon-dark.svg',
    //     darkIconUrl: '/icons/optimism-icon-light.svg',
    //     reservoirBaseUrl: 'https://api-optimism.reservoir.tools',
    //     proxyApi: '/api/reservoir/optimism',
    //     routePrefix: 'optimism',
    //     apiKey: process.env.OPTIMISM_RESERVOIR_API_KEY,
    //     coingeckoId: 'optimism',
    //     id: 300
    // },

    goerli: {
        name: 'Goerli',
        lightIconUrl: '/icons/goerli-icon-dark.svg',
        darkIconUrl: '/icons/goerli-icon-light.svg',
        reservoirBaseUrl: 'https://api-goerli.reservoir.tools',
        proxyApi: '/api/reservoir/goerli',
        routePrefix: 'goerli',
        apiKey: process.env.GOERLI_RESERVOIR_API_KEY,
        coingeckoId: 'goerli-eth',
        collectionSetId: process.env.NEXT_PUBLIC_GOERLI_COMMUNITY,
        community: process.env.NEXT_PUBLIC_GOERLI_COMMUNITY,
        id: 5
    }

    // bsctestnet: {
    //     name: 'Bsctestnet',
    //     lightIconUrl: '/icons/goerli-icon-dark.svg',
    //     darkIconUrl: '/icons/goerli-icon-light.svg',
    //     reservoirBaseUrl: 'https://api-goerli.reservoir.tools',
    //     proxyApi: '/api/reservoir/goerli',
    //     routePrefix: 'bsctestnet',
    //     apiKey: process.env.GOERLI_RESERVOIR_API_KEY,
    //     coingeckoId: 'goerli-eth',
    //     collectionSetId: process.env.NEXT_PUBLIC_GOERLI_COMMUNITY,
    //     community: process.env.NEXT_PUBLIC_GOERLI_COMMUNITY,
    //     id: 97
    // }
};
@Injectable()
export class ReservoirService {
    private client: ReservoirClient;

    constructor(
        private eventEmitter: EventEmitter2,
        @Inject(SHARED_EMITTER) private readonly sharedEmitter: EventEmitter,
        @InjectModel(COLLECTIONS)
        private collectionModel: Model<CollectionDocument>,
        @InjectModel(Listing.name)
        private listingModel: Model<ListingDocument>,
        @InjectModel(Bid.name)
        private bidModel: Model<BidDocument>
    ) {
        this.client = createClient({
            chains: [
                {
                    id: 1,
                    baseApiUrl: 'https://api.reservoir.tools',
                    active: true,
                    apiKey: process.env.RESERVOIR_API_KEY
                }
            ],
            source: 'YOUR.SOURCE'
        });
        this.listenForYetAnotherEvent();
    }
    // https://api-polygon.reservoir.tools

    getClient() {
        return this.client;
    }

    async getTokens(
        contract: string,
        chainName: string
    ): Promise<TokensResults> {
        try {
            sdk.auth(process.env.RESERVOIR_API_KEY);
            const chain = chains[chainName];

            sdk.server(chain.reservoirBaseUrl);

            const tokens = await sdk.getTokensV6({
                collection: contract,
                sortBy: 'tokenId',
                accept: '*/*'
            });

            const response: TokensResults = tokens?.data;
            return response;
        } catch (error) {
            console.log(`Tokens Error`, error);
        }
    }

    async getToken(contract: string, chainName: string, tokenId: string) {
        try {
            sdk.auth(process.env.RESERVOIR_API_KEY);
            const chain = chains[chainName];
            sdk.server(chain.reservoirBaseUrl);
            const tokens = await sdk.getTokensV6({
                tokens: `${contract}:${tokenId}`,
                includeAttributes: 'true',
                accept: '*/*',
                'attributes[ApeCoin Staked]': [
                    '0 - 1 ApeCoin',
                    '1000+ ApeCoin'
                ],
                'attributes[Background]': ['Purple', 'Yellow']
            });
            const response: TokensResults['tokens'][0] =
                tokens?.data?.tokens[0];
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getSearchCollections({
        name,
        // displayCurrency,
        // offset,
        limit = 5,
        accept = '*/*'
    }): Promise<SearchCollectionResults['collections']> {
        sdk.auth(process.env.RESERVOIR_API_KEY);
        const responses = [];
        let allCollections: SearchCollectionResults['collections'] = [];

        for (const chainName in chains) {
            console.log(chainName);

            try {
                const chain = chains[chainName];

                sdk.server(chain.reservoirBaseUrl);
                const result = await sdk.getSearchCollectionsV2({
                    name,
                    community: chain.community,
                    collectionsSetId: chain.collectionSetId,
                    limit,
                    accept
                });

                responses.push(result);
            } catch (error) {
                console.log(error);
            }
        }

        for (let index = 0; index < responses.length; index++) {
            const data = responses[index].data as SearchCollectionResults;
            const updatedCollections = data.collections.map((collection) => ({
                ...collection,
                chainName:
                    chains[
                        Object.keys(chains)[index]
                    ].routePrefix.toLowerCase(),
                chainId: chains[Object.keys(chains)[index]].id,
                lightChainIcon: chains[Object.keys(chains)[index]].lightIconUrl,
                darkChainIcon: chains[Object.keys(chains)[index]].darkIconUrl
            }));
            allCollections = allCollections.concat(updatedCollections);
        }

        return allCollections;
    }

    async findByConctractAddress(
        address
    ): Promise<SearchCollectionResults['collections']> {
        const promises = [];

        for (const chainName in chains) {
            const chain = chains[chainName];
            sdk.server(chain.reservoirBaseUrl);

            promises.push(
                await sdk.getCollectionsV5({
                    id: address,
                    accept: '*/*'
                })
            );
        }

        const responses = await Promise.all(promises);

        let allCollections = [];

        for (let index = 0; index < responses.length; index++) {
            const data = responses[index].data;

            const updatedCollections = data.collections.map((collection) => ({
                collectionId: collection.id,
                contract: collection.primaryContract,
                image: collection.image,
                name: collection.name,
                allTimeVolume: collection.volume?.allTime,
                floorAskPrice: collection.floorAsk?.price?.amount?.decimal,
                openseaVerificationStatus: collection.openseaVerificationStatus,
                chainName:
                    chains[
                        Object.keys(chains)[index]
                    ].routePrefix.toLowerCase(),
                chainId: chains[Object.keys(chains)[index]].id,
                lightChainIcon: chains[Object.keys(chains)[index]].lightIconUrl,
                darkChainIcon: chains[Object.keys(chains)[index]].darkIconUrl
            }));
            allCollections = allCollections.concat(updatedCollections);
        }

        return allCollections;
    }

    async getCollections(
        query: CollectionQueryInput
    ): Promise<CollectionsResults> {
        try {
            sdk.auth(process.env.RESERVOIR_API_KEY);
            sdk.server(chains[query.chain || 'arbitreum'].reservoirBaseUrl);
            const { data } = await sdk.getCollectionsV5(query);
            const response = data as CollectionsResults;
            const collection = response.collections[0];
            if (collection) {
                await this.collectionModel
                    .findOneAndUpdate(
                        { contract: query?.id },
                        {
                            name: collection?.name,
                            description: collection?.description,
                            image: collection?.image,
                            chain: query.chain,
                            chainId: chains[query.chain || 'arbitreum'].id,
                            // currency: string;

                            // chain: string,

                            // chainId: number;

                            // tokens: [CollectionToken];

                            contract: collection?.id,

                            contract_name: collection?.name,

                            banner: collection?.banner,
                            external_url: collection?.externalUrl,
                            sample_images: collection?.sampleImages,
                            token_count: collection?.tokenCount,
                            is_auto_auction: collection?.collectionBidSupported,

                            // supply: number;

                            owners_total: collection?.ownerCount,

                            sales_1d: collection?.salesCount?.['1day'],

                            sales_7d: collection?.salesCount?.['7day'],

                            sales_30d: collection?.salesCount?.['30day'],

                            sales_total: collection?.salesCount?.allTime,

                            volume_1d: collection?.volume?.['1day'],

                            volume_7d: collection?.volume?.['7day'],

                            volume_30d: collection?.volume?.['30day'],

                            volume_total: collection?.volume?.allTime,
                            createdAt: collection?.createdAt,

                            // floor_price: collection?.floorAsk?.price?.amount,

                            // average_price_1d: number;

                            // average_price_7d: number;

                            // average_price_30d: number;

                            // average_price_total: number;

                            // average_price_change_1d: number;

                            // average_price_change_7d: number;

                            // average_price_change_30d: number;

                            volume_change_1d:
                                collection?.volumeChange?.['1day'],

                            volume_change_7d:
                                collection?.volumeChange?.['2day'],

                            market_cap: collection?.volumeChange?.['3day'],

                            symbol: collection?.floorAsk?.price?.currency
                                ?.symbol,

                            // website: string;

                            // email: string;

                            twitter: collection?.twitterUsername,

                            // twitch?: string;

                            // land_id: string;

                            discord: collection?.discordUrl,

                            // telegram: collection?.tel

                            // github: collection?.g

                            // youtube: string;

                            // facebook: string;

                            // tiktok: string;

                            // web: string;

                            // instagram: string;

                            // medium: string;

                            // linkedin: collection?.li;

                            // featured_url: collection?.fea;

                            // large_image_url: collection?ima;

                            // ipfs_json_url: string;

                            // ipfs_image_url: string;

                            // attributes: [];

                            erc_type: collection?.contractKind,

                            // deploy_block_number: number;

                            // deployer_address: string;

                            // verified: boolean;

                            /* content creator fields */
                            // TODO:will be removed

                            // is_content_creator: boolean;

                            // is_auto_auction: boolean;

                            // is_auto_mint: boolean;

                            // listing_price: number;

                            // listing_type: string;

                            // auction_duration: number;
                            /* content creator fields */

                            opensea_verified:
                                collection?.openseaVerificationStatus ===
                                'verified',

                            royalty: collection?.royalties.bps

                            // "royalties": {
                            //   "recipient": "0xaae7ac476b117bccafe2f05f582906be44bc8ff1",
                            //   "breakdown": [
                            //     {
                            //       "bps": 250,
                            //       "recipient": "0xaae7ac476b117bccafe2f05f582906be44bc8ff1"
                            //     }
                            //   ],
                            //   "bps": 250
                            // },

                            // amounts_total: number;

                            // collections_with_same_name: [];

                            // price_symbol: string;

                            // followers: Types.ObjectId[];

                            // favourites: Types.ObjectId[];

                            // likes: Types.ObjectId[];

                            // views: Types.ObjectId[];
                        },
                        { upsert: true }
                    )
                    .exec();
            }
            this.eventEmitter.emit('order.created', {});

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getCollection(
        query: CollectionQueryInput
    ): Promise<CollectionsResults> {
        try {
            sdk.auth(process.env.RESERVOIR_API_KEY);
            sdk.server(chains[query.chain || 'arbitreum'].reservoirBaseUrl);
            const { data } = await sdk.getCollectionsV5(query);
            const response = data as CollectionsResults;
            // const collection = response.collections[0];
            // if (collection) {
            //     await this.collectionModel
            //         .findOneAndUpdate(
            //             { contract: query?.id },
            //             {
            //                 name: collection?.name,
            //                 description: collection?.description,
            //                 image: collection?.image,
            //                 chain: query.chain,
            //                 chainId: chains[query.chain || 'arbitreum'].id,
            //                 // currency: string;

            //                 // chain: string,

            //                 // chainId: number;

            //                 // tokens: [CollectionToken];

            //                 contract: collection?.id,

            //                 contract_name: collection?.name,

            //                 banner: collection?.banner,
            //                 external_url: collection?.externalUrl,
            //                 sample_images: collection?.sampleImages,
            //                 token_count: collection?.tokenCount,
            //                 is_auto_auction: collection?.collectionBidSupported,

            //                 // supply: number;

            //                 owners_total: collection?.ownerCount,

            //                 sales_1d: collection?.salesCount?.['1day'],

            //                 sales_7d: collection?.salesCount?.['7day'],

            //                 sales_30d: collection?.salesCount?.['30day'],

            //                 sales_total: collection?.salesCount?.allTime,

            //                 volume_1d: collection?.volume?.['1day'],

            //                 volume_7d: collection?.volume?.['7day'],

            //                 volume_30d: collection?.volume?.['30day'],

            //                 volume_total: collection?.volume?.allTime,
            //                 createdAt: collection?.createdAt,

            //                 // floor_price: collection?.floorAsk?.price?.amount,

            //                 // average_price_1d: number;

            //                 // average_price_7d: number;

            //                 // average_price_30d: number;

            //                 // average_price_total: number;

            //                 // average_price_change_1d: number;

            //                 // average_price_change_7d: number;

            //                 // average_price_change_30d: number;

            //                 volume_change_1d:
            //                     collection?.volumeChange?.['1day'],

            //                 volume_change_7d:
            //                     collection?.volumeChange?.['2day'],

            //                 market_cap: collection?.volumeChange?.['3day'],

            //                 symbol: collection?.floorAsk?.price?.currency
            //                     ?.symbol,

            //                 // website: string;

            //                 // email: string;

            //                 twitter: collection?.twitterUsername,

            //                 // twitch?: string;

            //                 // land_id: string;

            //                 discord: collection?.discordUrl,

            //                 // telegram: collection?.tel

            //                 // github: collection?.g

            //                 // youtube: string;

            //                 // facebook: string;

            //                 // tiktok: string;

            //                 // web: string;

            //                 // instagram: string;

            //                 // medium: string;

            //                 // linkedin: collection?.li;

            //                 // featured_url: collection?.fea;

            //                 // large_image_url: collection?ima;

            //                 // ipfs_json_url: string;

            //                 // ipfs_image_url: string;

            //                 // attributes: [];

            //                 erc_type: collection?.contractKind,

            //                 // deploy_block_number: number;

            //                 // deployer_address: string;

            //                 // verified: boolean;

            //                 /* content creator fields */
            //                 // TODO:will be removed

            //                 // is_content_creator: boolean;

            //                 // is_auto_auction: boolean;

            //                 // is_auto_mint: boolean;

            //                 // listing_price: number;

            //                 // listing_type: string;

            //                 // auction_duration: number;
            //                 /* content creator fields */

            //                 opensea_verified:
            //                     collection?.openseaVerificationStatus ===
            //                     'verified',

            //                 royalty: collection?.royalties.bps

            //                 // "royalties": {
            //                 //   "recipient": "0xaae7ac476b117bccafe2f05f582906be44bc8ff1",
            //                 //   "breakdown": [
            //                 //     {
            //                 //       "bps": 250,
            //                 //       "recipient": "0xaae7ac476b117bccafe2f05f582906be44bc8ff1"
            //                 //     }
            //                 //   ],
            //                 //   "bps": 250
            //                 // },

            //                 // amounts_total: number;

            //                 // collections_with_same_name: [];

            //                 // price_symbol: string;

            //                 // followers: Types.ObjectId[];

            //                 // favourites: Types.ObjectId[];

            //                 // likes: Types.ObjectId[];

            //                 // views: Types.ObjectId[];
            //             },
            //             { upsert: true }
            //         )
            //         .exec();
            // }
            // this.eventEmitter.emit('order.created', {});

            return response;
        } catch (error) {
            console.log(error);
        }
    }

    listenForYetAnotherEvent(): void {
        this.sharedEmitter.on('test', (data) => {
            console.log('Received yet another event:', data);
        });
    }

    async insertTopCollections(chainName: string) {
        try {
            if (!chainName) {
                return;
            }
            sdk.auth(process.env.RESERVOIR_API_KEY);
            const chain = chains[chainName];

            sdk.server(chain.reservoirBaseUrl);

            const response = await sdk.getCollectionsV6({
                sortBy: '1DayVolume',
                limit: '20',
                accept: '*/*'
            });
            const data = response?.data as CollectionsResults;

            const updatedCollections = data.collections.map((collection) => ({
                contract: collection.id,
                image: collection.image,
                name: collection.name,
                // image: collection?.image,
                token_count: collection?.tokenCount,
                chain: chain.routePrefix,
                chainName: chain.routePrefix,
                chainId: chain.id,
                lightChainIcon: chain.lightIconUrl,
                darkChainIcon: chain.darkIconUrl,
                allTimeVolume: collection.volume?.allTime,
                floorAskPrice: collection.floorAsk?.price?.amount?.decimal,
                floor_price: collection.floorAsk?.price?.amount?.decimal,
                openseaVerificationStatus: collection.openseaVerificationStatus,
                description: collection?.description,
                // contract: collection?.id,
                contract_name: collection?.name,
                banner: collection?.banner,
                external_url: collection?.externalUrl,
                sample_images: collection?.sampleImages,
                is_auto_auction: collection?.collectionBidSupported,
                owners_total: collection?.ownerCount,
                sales_1d: collection?.salesCount?.['1day'],
                sales_7d: collection?.salesCount?.['7day'],
                sales_30d: collection?.salesCount?.['30day'],
                sales_total: collection?.salesCount?.allTime,
                volume_1d: collection?.volume?.['1day'],
                volume_7d: collection?.volume?.['7day'],
                volume_30d: collection?.volume?.['30day'],
                volume_total: collection?.volume?.allTime,
                createdAt: collection?.createdAt,
                volume_change_1d: collection?.volumeChange?.['1day'],
                volume_change_7d: collection?.volumeChange?.['2day'],
                market_cap: collection?.volumeChange?.['3day'],
                symbol: collection?.floorAsk?.price?.currency?.symbol,
                twitter: collection?.twitterUsername,
                discord: collection?.discordUrl,
                erc_type: collection?.contractKind,
                opensea_verified:
                    collection?.openseaVerificationStatus === 'verified',
                royalty: collection?.royalties?.bps
            }));

            await this.collectionModel.insertMany(updatedCollections, {
                ordered: false
            });
        } catch (error) {
            console.log('Mongo Error', error);
            // if (error.code === 11000 || error.code === 11001) {
            //     console.log('BulkWriteError, duplicate key:', error);
            // } else {
            //     throw error;
            // }
            // if (error instanceof MongooseError) {
            //     if (error.code === 11000) {
            //         console.log('BulkWriteError, duplicate key:', error);
            //     }
            // } else {
            //     throw error;
            // }
        }
    }

    // async search(keyword: string) {
    //     const responses = [];
    //     let isAddress = ethers.utils.isAddress(keyword as string);
    //     if (isAddress) {
    //         const data = await this.findByConctractAddress(keyword);
    //     }
    //     // this.getSearchCollections({ name: keyword });
    // }

    async getListings(contract: string): Promise<ListingResults> {
        try {
            sdk.auth(process.env.RESERVOIR_API_KEY);

            const listings = await sdk.getOrdersAsksV5({
                status: 'active',
                contracts: contract,
                accept: '*/*'
            });
            return listings?.data;
        } catch (error) {
            console.log(error);
        }
    }

    async getBids(contract: string): Promise<BidResults> {
        try {
            sdk.auth(process.env.RESERVOIR_API_KEY);

            const bids = await sdk.getOrdersBidsV6({
                collection: contract,
                accept: '*/*'
            });
            return bids?.data;
        } catch (error) {
            console.log(error);
        }
    }

    async getHistory(contract: string): Promise<ActivitiesResults> {
        try {
            sdk.auth(process.env.RESERVOIR_API_KEY);

            const history = await sdk.getCollectionsActivityV6({
                collection: contract,
                types: 'sale',
                accept: '*/*'
            });

            return history?.data;
        } catch (error) {
            console.log(error);
        }
    }

    // async currencyConvertor(contract: string): Promise<ActivitiesResults> {
    //     try {
    //         sdk.auth(process.env.RESERVOIR_API_KEY);
    //         console.log(Object.keys(sdk), 'sdk');

    //         const response = await sdk
    //             .getCurrenciesConversionV1({
    //                 from: 'btc',
    //                 to: 'eth',
    //                 accept: '*/*'
    //             })
    //             .then(({ data }) => console.log(data))
    //             .catch((err) => console.error(err));
    //         console.log(response, 'response');

    //         return response?.data;
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
}
