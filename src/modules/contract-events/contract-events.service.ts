import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ethers } from 'ethers';
import { Model } from 'mongoose';
import { COLLECTIONS } from 'src/constants/db.collections';
import { CollectionDocument } from '../collections/entities/collection.entity';
import { content_creator_abi } from 'src/abis/content-creators';
import { HttpService } from '@nestjs/axios';
import { Nft, NftDocument } from '../nfts/entities/nft.entity';

@Injectable()
export class ContractEventsService implements OnModuleInit {
    private provider: ethers.providers.JsonRpcProvider;

    constructor(
        @InjectModel(COLLECTIONS)
        private collectionModel: Model<CollectionDocument>,
        @InjectModel(Nft.name)
        private tokenModel: Model<NftDocument>,
        private httpService: HttpService
    ) {
        this.provider = new ethers.providers.JsonRpcProvider(
            'https://polygon.llamarpc.com'
            // 'https://mainnet.infura.io/v3/your-infura-project-id'
        );
    }

    async onModuleInit() {
        await this.listenToEvents();
    }

    private async listenToEvents() {
        const collections = await this.collectionModel
            .find({
                is_content_creator: true,
                chain: 'polygon'
            })
            .exec();

        const contracts = collections.map((collection) => {
            const contract = new ethers.Contract(
                collection?.contract,
                content_creator_abi,
                this.provider
            );
            return contract;
        });

        contracts.forEach((contract, i) => {
            contract.on('Transfer', async (from, to, tokenId, event) => {
                try {
                    const transaction = await contract.provider.getTransaction(
                        event.transactionHash
                    );
                    console.log('Received event:');
                    console.log('From:', from);
                    console.log('To:', to);
                    console.log('Token ID:', tokenId.toString());
                    console.log('Transaction:', transaction);

                    const tokenURI = await contract.tokenURI(tokenId);
                    console.log('Token URI:', tokenURI);

                    const tokenMetadata = await this.httpService
                        .get(tokenURI)
                        .toPromise();
                    console.log('Token Metadata:', tokenMetadata.data);

                    const existingToken = await this.tokenModel
                        .findOne({
                            contract: collections[i].contract,
                            chain: 'polygon',
                            tokenId: tokenId.toString()
                        })
                        .exec();

                    if (existingToken) {
                        console.log(
                            'Token already exists in the database:',
                            existingToken
                        );
                    } else {
                        const newToken = await this.tokenModel.create({
                            tokenId: tokenId.toString(),
                            ...tokenMetadata.data,
                            chain: 'polygon',
                            externalLink: tokenMetadata.data?.external_url,
                            contract: collections[i].contract,
                            ...transaction
                            // Additional token data
                        });
                        console.log('New token created:', newToken);
                    }
                } catch (error) {
                    console.error('Error retrieving transaction:', error);
                }
            });
        });
    }

    // private async getContractAbi(address: string): Promise<any[]> {
    //     const response = await fetch(
    //         `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}`
    //     );
    //     const result = await response.json();
    //     return JSON.parse(result.result);
    // }
}
