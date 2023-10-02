import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './entities/categories.entity';
import { CreateCategoryInput } from './dto/create-categories.input';
import {
    CategoryFilterInput,
    UpdateCategoryInput
} from './dto/update-categories.input';
import {
    StakingCollection,
    StakingCollectionDocument
} from '../staking/entities/collection.staking.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category.name)
        private categoryModal: Model<CategoryDocument>,
        @InjectModel(StakingCollection.name)
        private stakingModal: Model<StakingCollectionDocument>
    ) {}

    async create(createCategoryInput: CreateCategoryInput): Promise<Category> {
        const createdStakingCollection = new this.categoryModal(
            createCategoryInput
        );
        return createdStakingCollection.save();
    }

    async findAll(query: CategoryFilterInput): Promise<CategoryDocument[]> {
        const filters: FilterQuery<CategoryDocument> = {};
        if (query?.name) {
            const keywordRegex = new RegExp(query.name, 'i');
            filters.name = { $regex: keywordRegex };
        }

        const stakings = await this.stakingModal.find().exec();

        const uniqueCategories = new Set<string>();
        const categories: CategoryDocument[] = [];

        stakings.forEach((item) => {
            const lowercaseCategory = item?.category.toLowerCase();
            if (!uniqueCategories.has(lowercaseCategory)) {
                uniqueCategories.add(lowercaseCategory);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                categories.push({
                    name: item?.category,
                    _id: new Types.ObjectId()
                });
            }
        });
        return categories;
        // return this.categoryModal.find(filters).exec();
    }

    async findOne(id: string): Promise<Category> {
        return this.categoryModal.findById(id).exec();
    }

    async update(
        id: string,
        updateCategoryInput: UpdateCategoryInput
    ): Promise<Category> {
        return this.categoryModal
            .findByIdAndUpdate(id, updateCategoryInput, { new: true })
            .exec();
    }

    async remove(id: string): Promise<Category> {
        return this.categoryModal.findByIdAndRemove(id).exec();
    }
}
