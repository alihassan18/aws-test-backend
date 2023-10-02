import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Utility, UtilityDocument } from './entities/utilities.entity';
import { CreateUtilityInput } from './dto/create-utilities.input';
import {
    UtilityFilterInput,
    UpdateUtilityInput
} from './dto/update-utilities.input';

@Injectable()
export class UtilityService {
    constructor(
        @InjectModel(Utility.name)
        private categoryModal: Model<UtilityDocument>
    ) {}

    async create(createUtilityInput: CreateUtilityInput): Promise<Utility> {
        const createdStakingCollection = new this.categoryModal(
            createUtilityInput
        );
        return createdStakingCollection.save();
    }

    async findAll(query: UtilityFilterInput): Promise<Utility[]> {
        const filters: FilterQuery<UtilityDocument> = {};
        if (query?.name) {
            const keywordRegex = new RegExp(query.name, 'i');
            filters.name = { $regex: keywordRegex };
        }

        return this.categoryModal.find(filters).exec();
    }

    async findOne(id: string): Promise<Utility> {
        return this.categoryModal.findById(id).exec();
    }

    async update(
        id: string,
        updateUtilityInput: UpdateUtilityInput
    ): Promise<Utility> {
        return this.categoryModal
            .findByIdAndUpdate(id, updateUtilityInput, { new: true })
            .exec();
    }

    async remove(id: string): Promise<Utility> {
        return this.categoryModal.findByIdAndRemove(id).exec();
    }
}
