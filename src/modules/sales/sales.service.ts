import { Injectable } from '@nestjs/common';
import { CreateSalesInput, FindSalesQuery } from './dto/create-sales.input';
import { UpdateSalesInput } from './dto/update-sales.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sales, SalesDocument } from './entities/sales.entity';
import { PaginatedResults } from 'src/interfaces/common.interface';

@Injectable()
export class SalesService {
    constructor(
        @InjectModel(Sales.name)
        private salesModel: Model<SalesDocument>
    ) {}

    create(createSalesInput: CreateSalesInput) {
        console.log(createSalesInput);

        return 'This action adds a new bid';
    }

    async findAll(
        query: FindSalesQuery
    ): Promise<PaginatedResults<SalesDocument>> {
        const page = query?.page || 1; // Current page number
        const pageSize = query?.pageSize || 20; // Number of items per page

        const skip = (page - 1) * pageSize; // Calculate the number of items to skip

        const totalCountPromise = this.salesModel
            .countDocuments({
                contract: query?.contract,
                'order.criteria.kind': 'token'
            })
            .exec(); // Total number of items

        const historyDocumentsPromise = this.salesModel
            .find({ contract: query?.contract, 'order.criteria.kind': 'token' })
            .skip(skip)
            .limit(pageSize)
            .exec();

        const [totalCount, historyDocuments] = await Promise.all([
            totalCountPromise,
            historyDocumentsPromise
        ]);
        const hasNextPage =
            (page - 1) * pageSize + historyDocuments.length < totalCount;

        return {
            records: historyDocuments,
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

    update(id: number, updateSalesInput: UpdateSalesInput) {
        console.log(updateSalesInput);

        return `This action updates a #${id} bid`;
    }

    remove(id: number) {
        return `This action removes a #${id} bid`;
    }
}
