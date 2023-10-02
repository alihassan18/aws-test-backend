import { Injectable } from '@nestjs/common';
import {
    CreateHistoryInput,
    FindHistoryQuery
} from './dto/create-history.input';
import { UpdateHistoryInput } from './dto/update-history.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { History, HistoryDocument } from './entities/history.entity';
import { PaginatedResults } from 'src/interfaces/common.interface';

@Injectable()
export class HistoryService {
    constructor(
        @InjectModel(History.name)
        private historyModel: Model<HistoryDocument>
    ) {}
    create(createHistoryInput: CreateHistoryInput) {
        console.log(createHistoryInput);

        return 'This action adds a new bid';
    }

    async findAll(
        query: FindHistoryQuery
    ): Promise<PaginatedResults<HistoryDocument>> {
        const page = query?.page || 1; // Current page number
        const pageSize = query?.pageSize || 20; // Number of items per page

        const skip = (page - 1) * pageSize; // Calculate the number of items to skip

        const totalCountPromise = this.historyModel
            .countDocuments({
                contract: query?.contract,
                'order.criteria.kind': 'token'
            })
            .exec(); // Total number of items

        const historyDocumentsPromise = this.historyModel
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

    update(id: number, updateHistoryInput: UpdateHistoryInput) {
        console.log(updateHistoryInput);

        return `This action updates a #${id} bid`;
    }

    remove(id: number) {
        return `This action removes a #${id} bid`;
    }
}
