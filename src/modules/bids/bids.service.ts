import { Injectable } from '@nestjs/common';
import { CreateBidInput, FindBidsQuery } from './dto/create-bid.input';
import { UpdateBidInput } from './dto/update-bid.input';
import { InjectModel } from '@nestjs/mongoose';
import { Listing, ListingDocument } from '../listings/entities/listing.entity';
import { Model } from 'mongoose';
import { PaginatedResults } from 'src/interfaces/common.interface';
import { Bid, BidDocument } from './entities/bid.entity';

@Injectable()
export class BidsService {
    constructor(
        @InjectModel(Listing.name)
        private listingModel: Model<ListingDocument>,
        @InjectModel(Bid.name)
        private bidModel: Model<BidDocument>
    ) {}
    create(createBidInput: CreateBidInput) {
        console.log(createBidInput);

        return 'This action adds a new bid';
    }

    // findAll(query: FindBidsQuery): Promise<ListingDocument[]> {
    //     return this.listingModel
    //         .find({
    //             contract: query?.contract,
    //             validUntil: {
    //                 $gte: new Date().getTime() / 1000
    //             }
    //         })
    //         .sort({
    //             validUntil: 1
    //         })
    //         .limit(20);
    // }

    async findAll(
        query: FindBidsQuery
    ): Promise<PaginatedResults<BidDocument>> {
        const page = query?.page || 1; // Current page number
        const pageSize = query?.pageSize || 20; // Number of items per page

        const skip = (page - 1) * pageSize; // Calculate the number of items to skip

        const totalCountPromise = this.bidModel
            .countDocuments({
                contract: query?.contract,
                'criteria.kind': 'token'
            })
            .exec(); // Total number of items

        const bidDocumentsPromise = this.bidModel
            .find({ contract: query?.contract, 'criteria.kind': 'token' })
            .skip(skip)
            .limit(pageSize)
            .exec();

        const [totalCount, bidDocuments] = await Promise.all([
            totalCountPromise,
            bidDocumentsPromise
        ]);
        const hasNextPage =
            (page - 1) * pageSize + bidDocuments.length < totalCount;

        return {
            records: bidDocuments,
            pageInfo: {
                page,
                pageSize,
                totalCount,
                hasNextPage
            }
        };
    }

    findOne(id: number) {
        return `This action returns a #${id} bid`;
    }

    update(id: number, updateBidInput: UpdateBidInput) {
        console.log(updateBidInput);

        return `This action updates a #${id} bid`;
    }

    remove(id: number) {
        return `This action removes a #${id} bid`;
    }
}
