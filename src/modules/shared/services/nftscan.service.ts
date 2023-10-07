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
const sdk = require('api')('@reservoirprotocol/v3.0#3m1djscljiyyrew');
import EventEmitter from 'events';
import { SHARED_EMITTER } from 'src/constants/socket.constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
// import { /* ErcType, */ EvmChain, NftscanEvm } from 'nftscan-api';

// const config = {
//     apiKey: process.env.NFT_SCAN_API_KEY, // Replace with your NFTScan API key.
//     chain: EvmChain.ETH // Replace with your chain.
// };

// const evm = new NftscanEvm(config);

type SearchCollectionResults =
    paths['/search/collections/v2']['get']['responses']['200']['schema'];
type CollectionsResults =
    paths['/collections/v5']['get']['responses']['200']['schema'];
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
        name: 'Ethereum',
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
    }
    // polygon: {
    //     name: 'Polygon',
    //     lightIconUrl: '/icons/polygon-icon-dark.svg',
    //     darkIconUrl: '/icons/polygon-icon-light.svg',
    //     reservoirBaseUrl: 'https://api-polygon.reservoir.tools',
    //     proxyApi: '/api/reservoir/polygon',
    //     routePrefix: 'polygon',
    //     apiKey: process.env.POLYGON_RESERVOIR_API_KEY,
    //     coingeckoId: 'matic-network',
    //     collectionSetId: process.env.NEXT_PUBLIC_POLYGON_COLLECTION_SET_ID,
    //     community: process.env.NEXT_PUBLIC_POLYGON_COMMUNITY,
    //     id: 137
    // },

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

    // goerli: {
    //     name: 'Goerli',
    //     lightIconUrl: '/icons/goerli-icon-dark.svg',
    //     darkIconUrl: '/icons/goerli-icon-light.svg',
    //     reservoirBaseUrl: 'https://api-goerli.reservoir.tools',
    //     proxyApi: '/api/reservoir/goerli',
    //     routePrefix: 'goerli',
    //     apiKey: process.env.GOERLI_RESERVOIR_API_KEY,
    //     coingeckoId: 'goerli-eth',
    //     collectionSetId: process.env.NEXT_PUBLIC_GOERLI_COMMUNITY,
    //     community: process.env.NEXT_PUBLIC_GOERLI_COMMUNITY,
    //     id: 5
    // },

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
export class NFTScanService {
    private client: ReservoirClient;

    constructor(
        private eventEmitter: EventEmitter2,
        @Inject(SHARED_EMITTER) private readonly sharedEmitter: EventEmitter,
        @InjectModel(COLLECTIONS)
        private collectionModel: Model<CollectionDocument>
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

    async getTokens() {
        const res = await fetch(
            'https://api.reservoir.tools/tokens/v5?limit=20&collection=0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d'
        );
        const data = await res.json();

        const response =
            data as paths['/tokens/v5']['get']['responses']['200']['schema'];
        return response;
    }

    async getSearchCollections({
        name,
        // displayCurrency,
        // offset,
        limit = 5,
        accept = '*/*'
    }): Promise<SearchCollectionResults['collections']> {
        sdk.auth(process.env.RESERVOIR_API_KEY);
        const allPromises = [];
        for (const chainName in chains) {
            const chain = chains[chainName];

            sdk.server(chain.reservoirBaseUrl);

            allPromises.push(
                sdk.getSearchCollectionsV2({
                    name,
                    community: chain.community,
                    // displayCurrency,
                    collectionsSetId: chain.collectionSetId,
                    // offset,
                    limit,
                    accept
                })
            );
        }

        let allCollections: SearchCollectionResults['collections'] = [];

        const responses = await Promise.all(allPromises);

        for (let index = 0; index < responses.length; index++) {
            const data = responses[index].data as SearchCollectionResults;
            const updatedCollections = data.collections.map((collection) => ({
                ...collection,
                chainName:
                    chains[Object.keys(chains)[index]].name.toLowerCase(),
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
                sdk.getCollectionsV5({
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
                    chains[Object.keys(chains)[index]].name.toLowerCase(),
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

    async insertTopCollections() {
        try {
            sdk.auth(process.env.RESERVOIR_API_KEY);

            const promises = [];
            for (const chainName in chains) {
                const chain = chains[chainName];

                sdk.server(chain.reservoirBaseUrl);

                promises.push(
                    sdk.getCollectionsV5({
                        sortBy: '1DayVolume',
                        limit: '20',
                        accept: '*/*'
                    })
                );
            }

            const responses = await Promise.all(promises);
            // console.log(responses, 'responses');

            let allCollections = [];

            for (let index = 0; index < responses.length; index++) {
                const data = responses[index].data as CollectionsResults;

                const updatedCollections = data.collections.map(
                    (collection) => ({
                        contract: collection.id,
                        image: collection.image,
                        name: collection.name,
                        // image: collection?.image,
                        token_count: collection?.tokenCount,
                        chain: chains[
                            Object.keys(chains)[index]
                        ].name.toLowerCase(),
                        chainName:
                            chains[
                                Object.keys(chains)[index]
                            ].name.toLowerCase(),
                        chainId: chains[Object.keys(chains)[index]].id,
                        lightChainIcon:
                            chains[Object.keys(chains)[index]].lightIconUrl,
                        darkChainIcon:
                            chains[Object.keys(chains)[index]].darkIconUrl,

                        allTimeVolume: collection.volume?.allTime,
                        floorAskPrice:
                            collection.floorAsk?.price?.amount?.decimal,
                        openseaVerificationStatus:
                            collection.openseaVerificationStatus,
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
                            collection?.openseaVerificationStatus ===
                            'verified',
                        royalty: collection?.royalties?.bps
                    })
                );
                allCollections = allCollections.concat(updatedCollections);
            }

            const pa = [];

            for (const collection of allCollections) {
                pa.push(
                    sdk.getCollectionsCollectionAttributesAllV4({
                        collection: collection.contract,
                        accept: '*/*'
                    })
                );
            }

            // for (const item of attributes) {
            //     const attribute = item?.data as AttributeResults;
            //     const aa = await this.attributeModel.insertMany(
            //         attribute.attributes
            //     );
            //     console.log(aa, 'attribute.attributes');
            // }

            await this.collectionModel.insertMany(allCollections, {
                ordered: false
            });

            // for (let i = 0; i < allCollections.length; i++) {
            //     const collection = allCollections[i] as CollectionDocument;
            //     const attributes =
            //         await sdk.getCollectionsCollectionAttributesAllV4({
            //             collection: collection.contract,
            //             accept: '*/*'
            //         });
            //     console.log(attributes);
            // }

            // console.log(results, 'results');

            return allCollections;
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
}
