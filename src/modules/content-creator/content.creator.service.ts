import { Injectable } from '@nestjs/common';
import {
    ContentCreatorFilterInput,
    ContentCreatorResponse,
    CreateContentCreatorInput
} from './dto/create-content.creator.input';
import { UpdateContentCreatorInput } from './dto/update-content.creator.input';
import { InjectModel } from '@nestjs/mongoose';
import {
    ContentCreator,
    ContentCreatorDocument
} from './entities/content.creator.entity';
import { FilterQuery, Model, Types } from 'mongoose';
import { env } from 'process';
import { EvmChain, NftscanEvm /* RangeType */ } from 'nftscan-api';
import { CommonTransactionResponse } from 'nftscan-api/dist/src/types/evm';
import { COLLECTIONS } from 'src/constants/db.collections';

@Injectable()
export class ContentCreatorService {
    constructor(
        @InjectModel(COLLECTIONS)
        private collectionModel: Model<ContentCreatorDocument>
    ) {}
    async findById(id: string | Types.ObjectId): Promise<ContentCreator> {
        return this.collectionModel.findById(id).exec();
    }

    create(
        createContentCreatorInput: CreateContentCreatorInput,
        creator: Types.ObjectId
    ): Promise<ContentCreator> {
        return this.collectionModel.create({
            ...createContentCreatorInput,
            creator
        });
    }

    async findAll(
        query: FilterQuery<ContentCreatorFilterInput>,
        limit: number,
        cursor?: string
    ): Promise<ContentCreatorResponse> {
        try {
            let updatedQuery = {};

            updatedQuery = {
                ...(cursor && {
                    _id: {
                        $gt: cursor // Fetch documents with _id greater than the provided cursor
                    }
                }),
                ...(query?.chain && {
                    chain: {
                        $in: query.chain
                    }
                }),
                ...query // include all other properties of query
            };

            const sort = {
                ...(query?.sort
                    ? {
                          [query?.sort?.type]: query?.sort?.value
                      }
                    : { createdAt: 1 })
            };

            const collections = await this.collectionModel
                .find(updatedQuery)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                .sort(sort)
                .limit(limit + 1)
                .exec();

            const hasNextPage = collections.length > limit;
            const edges = hasNextPage ? collections.slice(0, -1) : collections;
            const endCursor = hasNextPage
                ? edges[edges.length - 1]._id.toString()
                : null;

            return {
                records: edges,
                pageInfo: {
                    hasNextPage,
                    endCursor
                }
            };
        } catch (error) {
            console.log(error);
        }
    }

    async findByAddressAndChain(
        address: string,
        chain: string
    ): Promise<ContentCreatorDocument> {
        return this.collectionModel.findOne({
            chain,
            contract: address
        });
    }

    // async getContentCreatorListings(address: string, chain: string): Promise<any> {
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

    // async tradeDistribution(address: string, chain: string) {
    //     const evmChain =
    //         chain == 'BSC'
    //             ? 'BNB'
    //             : chain == 'ETH'
    //             ? 'ETH'
    //             : chain == 'MATIC'
    //             ? 'POLYGON'
    //             : chain == 'AVAX'
    //             ? 'AVALANCHE'
    //             : 'ETH';

    //     const config = {
    //         apiKey: env.NFT_SCAN_API_KEY, // Replace with your NFTScan API key.
    //         chain: EvmChain[evmChain] // Replace with your chain.
    //     };

    //     const evm = new NftscanEvm(config);
    //     const results: any[] = await evm.statistic.getContentCreatorTrade(
    //         address,
    //         RangeType.D1
    //     );
    //     return { data: results };
    // }

    // findOne(id:string): Promise<ContentCreatorDocument> {
    //     return this.collectionModel.findById(id);
    // }

    update(id: number, updateContentCreatorInput: UpdateContentCreatorInput) {
        console.log(updateContentCreatorInput);

        return `This action updates a #${id} collection`;
    }

    remove(id: number) {
        return `This action removes a #${id} collection`;
    }
}
