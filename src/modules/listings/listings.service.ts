import { Injectable } from '@nestjs/common';
import {
    CreateListingInput,
    FindListingsQuery
} from './dto/create-listing.input';
import { UpdateListingInput } from './dto/update-listing.input';
import { InjectModel } from '@nestjs/mongoose';
import { Listing, ListingDocument } from './entities/listing.entity';
import { Model } from 'mongoose';
import { PaginatedResults } from 'src/interfaces/common.interface';

@Injectable()
export class ListingsService {
    constructor(
        @InjectModel(Listing.name)
        private listingModel: Model<ListingDocument>
    ) {}
    create(createListingInput: CreateListingInput) {
        console.log(createListingInput);

        return 'This action adds a new listing';
    }

    // findAll(query: FindListingsQuery): Promise<ListingDocument[]> {
    //     return this.listingModel
    //         .find({
    //             contract: query?.contract
    //             // validUntil: {
    //             //     $gte: new Date().getTime() / 1000
    //             // }
    //         })
    //         .limit(20);
    //     // .sort({
    //     //     validUntil: 1
    //     // });
    // }

    async findAll(
        query: FindListingsQuery
    ): Promise<PaginatedResults<ListingDocument>> {
        const page = query?.page || 1; // Current page number
        const pageSize = query?.pageSize || 20; // Number of items per page

        const skip = (page - 1) * pageSize; // Calculate the number of items to skip

        const totalCountPromise = this.listingModel
            .countDocuments({
                contract: query?.contract,
                'criteria.kind': 'token'
            })
            .exec(); // Total number of items

        const listingDocumentsPromise = this.listingModel
            .find({ contract: query?.contract, 'criteria.kind': 'token' })
            .skip(skip)
            .limit(pageSize)
            .exec();

        const [totalCount, listingDocuments] = await Promise.all([
            totalCountPromise,
            listingDocumentsPromise
        ]);
        const hasNextPage =
            (page - 1) * pageSize + listingDocuments.length < totalCount;

        return {
            records: listingDocuments,
            pageInfo: {
                page,
                pageSize,
                totalCount,
                hasNextPage
            }
        };
    }

    findOne(id: number) {
        return `This action returns a #${id} listing`;
    }

    update(id: number, updateListingInput: UpdateListingInput) {
        console.log(updateListingInput);

        return `This action updates a #${id} listing`;
    }

    remove(id: number) {
        return `This action removes a #${id} listing`;
    }
}
