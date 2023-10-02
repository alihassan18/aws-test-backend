import { Injectable } from '@nestjs/common';
import {
    CreateNftInput,
    HiddenTokensInput,
    ListingStatus,
    TokenFilterInput,
    TokensCountsByStatus,
    TokensResponse
} from './dto/create-nft.input';
import { UpdateNftInput } from './dto/update-nft.input';
import { InjectModel } from '@nestjs/mongoose';
import { Nft, NftDocument } from './entities/nft.entity';
import { FilterQuery, Model, Types } from 'mongoose';
import { ReservoirService, chains } from '../shared/services/reservoir.service';
import { isEmpty } from 'class-validator';
import { Wallet, WalletDocument } from '../users/entities/wallet.entity';
import { EvmChain, NftscanEvm } from 'nftscan-api';
import { QueryMultiChainAssets } from 'nftscan-api/dist/src/types/evm';
import { Listing, ListingDocument } from '../listings/entities/listing.entity';
import { Post, PostDocument } from '../feeds/entities/post.entity';
import { Bid, BidDocument } from '../bids/entities/bid.entity';
import { User, UserDocument } from '../users/entities/user.entity';
import { generateOGImage } from 'src/helpers/linkPreviews';
import {
    HiddenTokens,
    HiddenTokensDocument
} from './entities/nft.hidden.entity';

@Injectable()
export class NftsService {
    constructor(
        @InjectModel(Nft.name)
        private tokenModel: Model<NftDocument>,
        @InjectModel(Listing.name)
        private listingModel: Model<ListingDocument>,
        @InjectModel(Wallet.name)
        private walletModel: Model<WalletDocument>,
        @InjectModel(Bid.name)
        private bidsModel: Model<BidDocument>,
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        @InjectModel(Post.name)
        private postModel: Model<PostDocument>,
        @InjectModel(HiddenTokens.name)
        private hideTokenModel: Model<HiddenTokensDocument>,
        private reservoirService: ReservoirService
    ) {
        // this.getUserTokens(new Types.ObjectId('644cae591d0d2f6bd1f5c6b3'));
    }

    async findById(id: Types.ObjectId) {
        return this.tokenModel.findById(id).exec();
    }
    create(createNftInput: CreateNftInput) {
        console.log(createNftInput);

        return 'This action adds a new nft';
    }
    createMany(createNftInput: CreateNftInput[]) {
        return this.tokenModel.create(createNftInput);
    }

    // async findAll(
    //     query: FilterQuery<TokenFilterInput>,
    //     limit: number,
    //     cursor?: string
    // ): Promise<TokensResponse> {
    //     try {
    //         let updatedQuery = {};
    //         updatedQuery = {
    //             ...(query?.keyword && {
    //                 $or: [
    //                     {
    //                         name: {
    //                             $regex: new RegExp(query?.keyword),
    //                             $options: 'i'
    //                         }
    //                     }, // Case-insensitive name search
    //                     { tokenId: query?.keyword }
    //                 ]
    //             }),
    //             ...(cursor && {
    //                 _id: {
    //                     $gt: new Types.ObjectId(cursor) // Fetch documents with _id greater than the provided cursor
    //                 }
    //             }),
    //             ...(query?.chain && {
    //                 chain: query.chain
    //             }),
    //             ...(query?.contract && {
    //                 contract: {
    //                     $regex: new RegExp(`^${query?.contract}$`, 'i')
    //                 }
    //             })
    //             // ...(query?.creator && {
    //             //     creator: new Types.ObjectId(query?.creator)
    //             // }),
    //             // ...(query?.owner && {
    //             //     owner: { $regex: new RegExp(`^${query?.owner}$`, 'i') }
    //             // }),
    //             // ...(query?.follower && {
    //             //     followers: { $in: [new Types.ObjectId(query?.follower)] }
    //             // })
    //         };

    //         const sort = {
    //             ...(query?.sort
    //                 ? {
    //                       _id: -1,
    //                       [query?.sort?.type]: query?.sort?.value
    //                   }
    //                 : { createdAt: 1 })
    //         };

    //         const tokens = await this.tokenModel
    //             .find(updatedQuery)
    //             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //             // @ts-ignore
    //             .sort(sort)
    //             .limit(limit + 1)
    //             .exec();

    //         const hasNextPage = tokens.length > limit;
    //         const edges = hasNextPage ? tokens.slice(0, -1) : tokens;
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

    // ...

    async updateNftViews(nftId: Types.ObjectId, timespent: number) {
        const nftToken = await this.tokenModel.findById(nftId);
        const post = await this.postModel.findById(nftToken?.post);
        const nftPrevViews = nftToken?.views || 0;
        const newTime = nftPrevViews + timespent;

        try {
            await this.tokenModel.findByIdAndUpdate(
                { _id: nftToken._id },
                { views: newTime },
                { new: true }
            );
            await this.postModel.findByIdAndUpdate(
                { _id: post._id },
                { postViews: newTime },
                { new: true }
            );
        } catch (error) {
            console.log('Error:', error);
        }
    }

    async getMostViewed() {
        try {
            const posts = await this.postModel
                .aggregate([
                    {
                        $match: {
                            $and: [
                                { tokenData: { $ne: null } },
                                { tokenData: { $exists: true } },
                                {
                                    collectionViewsTimestamps: {
                                        $gte: new Date(
                                            Date.now() - 24 * 60 * 60 * 1000
                                        )
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: 'collections',
                            localField: 'tokenData.contract',
                            foreignField: 'contract',
                            as: 'collectionInfo'
                        }
                    },
                    {
                        $unwind: '$collectionInfo'
                    },
                    {
                        $match: {
                            $and: [
                                { 'collectionInfo.is_content_creator': true }, // Filter by is_content_creator
                                {
                                    $expr: {
                                        $eq: [
                                            '$tokenData.contract',
                                            '$collectionInfo.contract'
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $limit: 20
                    },
                    {
                        $sort: {
                            postViews: -1
                        }
                    }
                ])
                // .aggregate([
                //     {
                //         $match: {
                //             $and: [
                //                 { tokenData: { $ne: null } },
                //                 { tokenData: { $exists: true } },
                //                 {
                //                     collectionViewsTimestamps: {
                //                         $gte: new Date(
                //                             Date.now() - 24 * 60 * 60 * 1000
                //                         )
                //                     }
                //                 }
                //             ]
                //         }
                //     },
                //     {
                //         $limit: 20
                //     },
                //     {
                //         $sort: {
                //             postViews: -1
                //         }
                //     }
                // ])
                .exec();
            return posts;
            // return await this.tokenModel.find().sort({ views: -1 }).limit(30);
        } catch (error) {
            console.log('Error:', error);
        }
    }

    async findAllListed(
        query: FilterQuery<TokenFilterInput>,
        limit: number,
        cursor?: string
    ) {
        try {
            const updatedQuery = {
                expiration: { $gt: Math.ceil(new Date().getTime() / 1000) }, // Filter out expired bids
                status: 'active',
                ...(query?.keyword && {
                    $or: [
                        {
                            name: {
                                $regex: new RegExp(query?.keyword),
                                $options: 'i'
                            }
                        },
                        { tokenId: query?.keyword }
                    ]
                }),
                ...(cursor && {
                    _id: {
                        $gt: new Types.ObjectId(cursor) // Fetch documents with _id greater than the provided cursor
                    }
                }),
                ...(query?.chain && {
                    chain: query.chain
                }),
                ...(query?.contract && {
                    contract: {
                        $regex: new RegExp(`^${query?.contract}$`, 'i')
                    }
                }),
                ...(query?.is_content_creator && {
                    'source.domain': 'dev.mintstartgram.com'
                })
            };

            const aggregationPipeline = [
                {
                    $match: updatedQuery
                },
                {
                    $lookup: {
                        from: 'nfts',
                        let: {
                            tokenId: '$criteria.data.token.tokenId',
                            contract: '$contract'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$tokenId', '$$tokenId']
                                            },
                                            {
                                                $eq: ['$contract', '$$contract']
                                            }
                                            // {
                                            //     $gte: [
                                            //         '$validUntil',
                                            //         new Date().getTime() / 1000
                                            //     ]
                                            // }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'token' // Rename the output field to "token"
                    }
                },
                {
                    $unwind: {
                        path: '$token',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        'token.market': {
                            // Move the listing data to the "market" field within the "token" object
                            price: '$price',
                            kind: '$kind',
                            side: '$side',
                            status: '$status',
                            tokenSetId: '$tokenSetId',
                            tokenSetSchemaHash: '$tokenSetSchemaHash',
                            maker: '$maker',
                            taker: '$taker',
                            validFrom: '$validFrom',
                            validUntil: '$validUntil',
                            quantityFilled: '$quantityFilled',
                            quantityRemaining: '$quantityRemaining',
                            dynamicPricing: '$dynamicPricing',
                            source: '$source',
                            feeBreakdown: '$feeBreakdown',
                            expiration: '$expiration',
                            createdAt: '$createdAt',
                            updatedAt: '$updatedAt'
                        }
                    }
                },

                {
                    $replaceRoot: {
                        newRoot: '$token'
                    }
                }
            ];

            const tokens = await this.listingModel
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                .aggregate(aggregationPipeline)
                // .sort(sort)
                .limit(limit + 1)
                .exec();

            const hasNextPage = tokens.length > limit;
            const edges = hasNextPage ? tokens.slice(0, -1) : tokens;
            const endCursor = hasNextPage
                ? edges[edges.length - 1]._id?.toString()
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
            throw error; // Don't forget to handle the error appropriately
        }
    }

    async findAllOnAuction(
        query: FilterQuery<TokenFilterInput>,
        limit: number,
        cursor?: string
    ) {
        try {
            const updatedQuery = {
                'criteria.kind': 'token',
                status: 'active',
                side: 'buy',
                ...(query?.keyword && {
                    $or: [
                        {
                            name: {
                                $regex: new RegExp(query?.keyword),
                                $options: 'i'
                            }
                        },
                        { tokenId: query?.keyword }
                    ]
                }),
                ...(cursor && {
                    _id: {
                        $gt: new Types.ObjectId(cursor) // Fetch documents with _id greater than the provided cursor
                    }
                }),
                ...(query?.chain && {
                    chain: query.chain
                }),
                ...(query?.contract && {
                    contract: {
                        $regex: new RegExp(`^${query?.contract}$`, 'i')
                    }
                })
            };

            const sort = {
                'price.amount.decimal': -1 // Sort in descending order of bid amount
            };

            const aggregationPipeline = [
                {
                    $match: updatedQuery
                },
                { $sort: sort },
                { $limit: limit + 1 },
                {
                    $lookup: {
                        from: 'nfts',
                        let: {
                            tokenId: '$criteria.data.token.tokenId',
                            contract: '$contract'
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: ['$tokenId', '$$tokenId']
                                            },
                                            {
                                                $eq: ['$contract', '$$contract']
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: 'token' // Rename the output field to "token"
                    }
                },
                {
                    $unwind: {
                        path: '$token',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $addFields: {
                        'token.market': {
                            // Move the listing data to the "market" field within the "token" object
                            price: '$price',
                            kind: '$kind',
                            side: '$side',
                            status: '$status',
                            tokenSetId: '$tokenSetId',
                            tokenSetSchemaHash: '$tokenSetSchemaHash',
                            maker: '$maker',
                            taker: '$taker',
                            validFrom: '$validFrom',
                            validUntil: '$validUntil',
                            quantityFilled: '$quantityFilled',
                            quantityRemaining: '$quantityRemaining',
                            dynamicPricing: '$dynamicPricing',
                            source: '$source',
                            feeBreakdown: '$feeBreakdown',
                            expiration: '$expiration',
                            createdAt: '$createdAt',
                            updatedAt: '$updatedAt'
                        }
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: '$token'
                    }
                }
            ];

            const tokens = await this.bidsModel
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                .aggregate(aggregationPipeline)
                .exec();

            const hasNextPage = tokens.length > limit;
            const edges = hasNextPage ? tokens.slice(0, -1) : tokens;
            const endCursor = hasNextPage
                ? edges[edges.length - 1]._id?.toString()
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
            throw error; // Don't forget to handle the error appropriately
        }
    }

    async getLinkPreview(
        contract: string,
        chain: string,
        tokenId: string
    ): Promise<{ link_preview: string }> {
        const token = await this.tokenModel.findOne({
            contract,
            chain,
            tokenId
        });

        let post = null;
        if (token?.post) {
            post = await this.postModel.findById(token.post);
        }

        const requiredObj =
            post && post?.reactions?.find((x) => x.emoji === 'like');
        const likeCounts = requiredObj ? requiredObj.count : 0;

        const preview = await generateOGImage(
            'nft',
            token?.name,
            token?.image || '',
            token?.description,
            '',
            token?.tokenId,
            0,
            post?.commentsCount || 0,
            post?.repostCount || 0,
            likeCounts,
            post?.postViews || 0
        );
        return { link_preview: preview || '' };
    }

    async findAllTokens(
        query: TokenFilterInput,
        limit: number,
        cursor?: string
    ) {
        try {
            const updatedQuery = {
                ...(query?.keyword && {
                    $or: [
                        {
                            name: {
                                $regex: new RegExp(query?.keyword),
                                $options: 'i'
                            }
                        },
                        { tokenId: query?.keyword }
                    ]
                }),
                ...(query?.attributes && {
                    $and: query?.attributes.map((attribute) => ({
                        [`attributes.key`]: attribute.key,
                        [`attributes.value`]: { $in: attribute.values }
                    }))
                }),
                ...(cursor && {
                    _id: {
                        $gt: new Types.ObjectId(cursor) // Fetch documents with _id greater than the provided cursor
                    }
                }),
                ...(query?.chain && {
                    chain: query.chain
                }),
                ...(query?.contract && {
                    contract: {
                        $regex: new RegExp(`^${query?.contract}$`, 'i')
                    }
                }),
                ...(query?.is_content_creator && {
                    is_content_creator: query?.is_content_creator
                }),
                // ...(query?.creator && {
                //     creator: new Types.ObjectId(query?.creator)
                // }),
                ...(query?.owner && {
                    owner: { $regex: new RegExp(`^${query?.owner}$`, 'i') }
                })
                // ...attributes
                // ...(query?.follower && {
                //     followers: { $in: [new Types.ObjectId(query?.follower)] }
                // })
            };

            // const sort = {
            //     ...(query?.sort
            //         ? {
            //               _id: -1,
            //               [query?.sort?.type]: query?.sort?.value
            //           }
            //         : { createdAt: 1 })
            // };

            const aggregationPipeline = [
                {
                    $match: updatedQuery
                },
                {
                    $lookup: {
                        from: 'listings',
                        let: { tokenId: '$tokenId', contract: '$contract' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: [
                                                    '$criteria.data.token.tokenId',
                                                    '$$tokenId'
                                                ]
                                            },
                                            {
                                                $eq: ['$contract', '$$contract']
                                            },
                                            {
                                                $gte: [
                                                    '$validUntil',
                                                    new Date().getTime() / 1000
                                                ]
                                            }
                                        ]
                                    }
                                }
                            },
                            {
                                $sort: { 'price.amount.decimal': 1 }
                            },
                            {
                                $limit: 1
                            }
                        ],
                        as: 'market'
                    }
                },
                {
                    $unwind: {
                        path: '$market',
                        preserveNullAndEmptyArrays: true
                    }
                }
                // {
                //     // Add the default sort by market here
                //     $sort: {
                //         'market.price.amount.decimal': -1 // 1 for ascending, -1 for descending
                //     }
                // }
                // {
                //     $project: {
                //         _id: 1,
                //         contract: 1,
                //         lowestPriceListing: {
                //             price: '$lowestPriceListing.price',
                //             id: '$lowestPriceListing.id'
                //         }
                //     }
                // }
            ];

            const tokens = await this.tokenModel
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                .aggregate(aggregationPipeline, {
                    allowDiskUse: true,
                    hint: { _id: 1 }
                })
                // .sort(sort)
                .limit(limit + 1)
                .exec();

            const hasNextPage = tokens.length > limit;
            const edges = hasNextPage ? tokens.slice(0, -1) : tokens;
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
            throw error; // Don't forget to handle the error appropriately
        }
    }

    async findAll(
        query: TokenFilterInput,
        limit: number,
        cursor?: string
    ): Promise<TokensResponse> {
        try {
            const status = query?.status || ListingStatus.ALL;
            if (status == ListingStatus.ALL) {
                const tokens = await this.findAllTokens(query, limit, cursor);
                return tokens;
            } else if (status == ListingStatus.AUCTION) {
                const tokens = await this.findAllOnAuction(
                    query,
                    limit,
                    cursor
                );
                return tokens;
            } else {
                const tokens = await this.findAllListed(query, limit, cursor);
                return tokens;
            }
        } catch (error) {
            console.log(error);
            throw error; // Don't forget to handle the error appropriately
        }
    }

    async countByStatus(
        contract: string,
        chain: string
    ): Promise<TokensCountsByStatus> {
        try {
            const listings = await this.listingModel
                .count({
                    contract: contract,
                    chain: chain
                })
                .exec();
            const tokens = await this.tokenModel
                .count({
                    contract: contract,
                    chain: chain
                })
                .exec();
            const bids = await this.bidsModel
                .count({
                    contract: contract,
                    chain: chain
                })
                .exec();

            return { listings, tokens, bids };
        } catch (error) {
            console.log('Count By Status', error);
        }
    }

    findOne(
        contract: string,
        chain: string,
        tokenId: string
    ): Promise<NftDocument> {
        return this.tokenModel.findOne({ contract: contract, chain, tokenId });
    }

    update(id: number, updateNftInput: UpdateNftInput) {
        console.log(updateNftInput);

        return `This action updates a #${id} nft`;
    }

    remove(id: number) {
        return `This action removes a #${id} nft`;
    }

    async findSingleToken(
        contract: string,
        chain: string,
        tokenId: string
    ): Promise<Nft> {
        try {
            const updatedQuery = {
                ...(chain && {
                    chain: chain
                }),
                ...(contract && {
                    contract: {
                        $regex: new RegExp(`^${contract}$`, 'i')
                    }
                }),
                ...(tokenId && {
                    tokenId: tokenId
                })
            };

            const aggregationPipeline = [
                {
                    $match: updatedQuery
                },
                {
                    $lookup: {
                        from: 'listings',
                        let: { tokenId: '$tokenId', contract: '$contract' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: [
                                                    '$criteria.data.token.tokenId',
                                                    '$$tokenId'
                                                ]
                                            },
                                            { $eq: ['$contract', '$$contract'] }
                                        ]
                                    }
                                }
                            },
                            {
                                $sort: { 'price.amount.decimal': 1 }
                            },
                            {
                                $limit: 1
                            }
                        ],
                        as: 'market'
                    }
                },
                {
                    $unwind: {
                        path: '$market',
                        preserveNullAndEmptyArrays: true
                    }
                }
            ];

            const token = await this.tokenModel
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                .aggregate(aggregationPipeline)
                .limit(1) // Fetch only one token
                .exec();

            return token[0] || null; // Return the single token or null if not found
        } catch (error) {
            console.log(error);
            throw error; // Don't forget to handle the error appropriately
        }
    }

    async getToken(contract: string, chain: string, tokenId: string) {
        try {
            if (isEmpty(chains[chain])) {
                throw new Error('This chain not supported');
            }
            let token = await this.findSingleToken(contract, chain, tokenId);

            if (token) {
                const market = await this.listingModel
                    .findOne({
                        'criteria.data.token.tokenId': tokenId,
                        contract: contract
                    })
                    .exec();

                token.market = market;
            }

            // let token = await this.tokenModel
            //     .findOne({
            //         contract: { $regex: new RegExp(`^${contract}$`, 'i') },
            //         chain: chain,
            //         tokenId: tokenId
            //     })
            //     .exec();
            if (!token) {
                const t = await this.reservoirService.getToken(
                    contract,
                    chain,
                    tokenId
                );
                const data = {
                    ...t?.token,
                    _collection: t?.token?.collection,
                    chain
                };
                token = await this.tokenModel.create(data);
                try {
                    const market = await this.listingModel.create({
                        ...(t?.market.floorAsk || t?.market.topBid)
                    });
                    token.market = market;
                } catch (error) {
                    console.log('Error while create listing in getToken');
                }
            }

            if (token && !token.post) {
                // Creating a post for nft-token
                const post = new this.postModel({
                    token: {
                        tokenId: token.tokenId,
                        contract: token.contract,
                        chain: token.chain,
                        image: token.image
                    }
                });
                await post.save();
                const updatedToken = await this.tokenModel
                    .findOneAndUpdate(
                        {
                            tokenId: token.tokenId,
                            contract: token.contract,
                            chain: token.chain
                        },
                        {
                            $set: { post: post._id }
                        },
                        { returnOriginal: false }
                    )
                    .exec();
                token = updatedToken;
            }

            return token;
        } catch (error) {
            console.log('Get token:', error);
        }
    }

    async getUserTokens(userId: string) {
        try {
            const wallets = await this.walletModel
                .find({
                    userId: new Types.ObjectId(userId)
                })
                .exec();

            if (!wallets.length) {
                return null;
            }

            const config = {
                apiKey: process.env.NFT_SCAN_API_KEY, // Replace with your NFTScan API key.
                chain: EvmChain.ETH // Replace with your chain.
            };

            const evm = new NftscanEvm(config);

            const promises = [];

            for (const iterator of wallets) {
                promises.push(
                    evm.asset?.getMultiChainAssets(iterator?.address, [
                        EvmChain?.BNB,
                        EvmChain?.ETH,
                        EvmChain?.POLYGON,
                        EvmChain?.AVALANCHE
                    ])
                );
            }

            const response = await Promise.all(promises);
            const hidden = await this.getHiddenTokens(userId);

            const tokens = [];

            for (const a of response) {
                const element: QueryMultiChainAssets[] = a;
                for (const b of element) {
                    for (const c of b.collection_assets) {
                        const assets = c.assets.map((obj) => {
                            const {
                                contract_address,
                                contract_name,
                                contract_token_id,
                                token_id,
                                erc_type,
                                amount,
                                minter,
                                owner,
                                own_timestamp,
                                mint_timestamp,
                                mint_transaction_hash,
                                mint_price,
                                token_uri,
                                metadata_json,
                                name,
                                content_type,
                                content_uri,
                                description,
                                image_uri,
                                external_link,
                                latest_trade_price,
                                latest_trade_symbol,
                                latest_trade_token,
                                latest_trade_timestamp,
                                nftscan_id,
                                nftscan_uri,
                                small_nftscan_uri,
                                attributes,
                                rarity_score,
                                rarity_rank
                            } = obj;

                            // Check if the token exists in the hidden tokens
                            const isHidden = hidden.some(
                                (hiddenToken) =>
                                    hiddenToken.contract === contract_address &&
                                    hiddenToken.tokenId === token_id
                            );

                            console.log(isHidden, contract_address, token_id);

                            // Push the asset into the tokens array only if it's not hidden
                            if (!isHidden) {
                                return {
                                    collection: {
                                        chain:
                                            b.chain == EvmChain.ETH
                                                ? 'ethereum'
                                                : b.chain,
                                        name: c.contract_name,
                                        contract: c.contract_address,
                                        contract_name: c.contract_name,
                                        image: c.logo_url,
                                        owns_total: c.owns_total,
                                        items_total: c.items_total,
                                        symbol: c.symbol,
                                        description: c.description,
                                        floor_price: c.floor_price,
                                        verified: c.verified,
                                        opensea_verified: c.opensea_verified,
                                        id: c.contract_address
                                    },
                                    contractAddress: contract_address,
                                    contract: contract_address,
                                    contractName: contract_name,
                                    contractTokenId: contract_token_id,
                                    tokenId: token_id,
                                    ercType: erc_type,
                                    kind: erc_type,
                                    amount,
                                    minter,
                                    owner,
                                    ownTimestamp: own_timestamp,
                                    mintTimestamp: mint_timestamp,
                                    mintTransactionHash: mint_transaction_hash,
                                    mintPrice: mint_price,
                                    tokenUri: token_uri,
                                    metadataJson: metadata_json,
                                    name: name
                                        ? name
                                        : contract_name + '#' + token_id,
                                    contentType: content_type,
                                    contentUri: content_uri,
                                    description,
                                    imageUri: image_uri,
                                    image: image_uri,
                                    externalLink: external_link,
                                    latestTradePrice: latest_trade_price,
                                    latestTradeSymbol: latest_trade_symbol,
                                    latestTradeToken: latest_trade_token,
                                    latestTradeTimestamp:
                                        latest_trade_timestamp,
                                    nftscanId: nftscan_id,
                                    nftscanUri: nftscan_uri,
                                    smallNftscanUri: small_nftscan_uri,
                                    attributes,
                                    rarityScore: rarity_score,
                                    rarityRank: rarity_rank,
                                    chain:
                                        b?.chain == EvmChain.ETH
                                            ? 'ethereum'
                                            : b?.chain
                                };
                            }

                            return null; // Return null for hidden assets
                        });

                        tokens.push(
                            ...assets.filter((asset) => asset !== null)
                        );
                    }
                }
            }

            // console.log(tokens, 'tokens');
            // console.log(response, 'response');
            return tokens;
        } catch (error) {
            console.log(error);
        }
    }

    async removeNFT(id: Types.ObjectId) {
        await this.tokenModel.findByIdAndUpdate(id, {
            $set: { is_deleted: true }
        });
        return { success: true };
    }

    async userStats(userId: Types.ObjectId) {
        const wallets = await this.walletModel
            .find({
                userId: userId
            })
            .exec();
        const address = wallets.map((item) => item?.address);
        // const minterCount = this.tokenModel.countDocuments({
        //     minter: { $in: address }
        // });
        const ownerCount = this.tokenModel.countDocuments({
            owner: { $in: address }
        });
        const listedCount = this.listingModel.countDocuments({
            maker: { $in: address }
        });
        const boughtCount = this.listingModel.countDocuments({
            taker: { $in: address },
            status: 'filled'
        });
        const soldCount = this.listingModel.countDocuments({
            maker: { $in: address },
            status: 'filled'
        });
        const [minted, owned, sold, bought, listed] = await Promise.all([
            0, //minterCount
            ownerCount,
            soldCount,
            boughtCount,
            listedCount
        ]);
        return { minted, owned, sold, bought, listed };
    }

    async hideToken(data: HiddenTokensInput): Promise<boolean> {
        try {
            const token = await this.hideTokenModel.findOne(data);

            if (token) {
                // If token found, remove it and return false
                await this.hideTokenModel.findByIdAndDelete(token._id);
                return false;
            }

            // If token not found, add it and return true
            await this.hideTokenModel.create(data);
            return true;
        } catch (error) {
            // Handle errors if needed
            console.error('Error in hideToken:', error);
            throw error;
        }
    }

    async hiddenTokens(userId): Promise<HiddenTokensDocument[]> {
        try {
            const tokens = await this.hideTokenModel
                .find({
                    userId: userId
                })
                .exec();
            return tokens;
        } catch (error) {
            // Handle errors if needed
            console.error('Error in hideToken:', error);
            throw error;
        }
    }

    async getHiddenTokens(userId: string): Promise<HiddenTokensDocument[]> {
        return this.hideTokenModel.find({
            userId: userId
        });
    }
}
