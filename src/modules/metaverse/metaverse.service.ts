import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Metaverse, MetaverseDocument } from './entities/metaverse.entity';
import { CreateMetaverseInput } from './dto/create-metaverse.input';
import {
    MetaverseFilterInput,
    UpdateMetaverseInput
} from './dto/update-metaverse.input';

@Injectable()
export class MetaverseService {
    constructor(
        @InjectModel(Metaverse.name)
        private categoryModal: Model<MetaverseDocument>
    ) {}

    async create(
        createMetaverseInput: CreateMetaverseInput
    ): Promise<Metaverse> {
        const createdStakingCollection = new this.categoryModal(
            createMetaverseInput
        );
        return createdStakingCollection.save();
    }

    async findAll(query: MetaverseFilterInput): Promise<Metaverse[]> {
        const filters: FilterQuery<MetaverseDocument> = {};
        if (query?.name) {
            const keywordRegex = new RegExp(query.name, 'i');
            filters.name = { $regex: keywordRegex };
        }

        return this.categoryModal.find(filters).exec();
    }

    async findOne(id: string): Promise<Metaverse> {
        return this.categoryModal.findById(id).exec();
    }

    async update(
        id: string,
        updateMetaverseInput: UpdateMetaverseInput
    ): Promise<Metaverse> {
        return this.categoryModal
            .findByIdAndUpdate(id, updateMetaverseInput, { new: true })
            .exec();
    }

    async remove(id: string): Promise<Metaverse> {
        return this.categoryModal.findByIdAndRemove(id).exec();
    }
}
