import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import {
    StakingCollection,
    StakingCollectionDocument
} from './entities/collection.staking.entity';
import { CreateStakingCollectionInput } from './dto/create-staking.input';
import {
    StakingFilterInput,
    UpdateStakingCollectionInput
} from './dto/update-staking.input';
import { Status } from './staking.enums';
import { Post, PostDocument } from '../feeds/entities/post.entity';

@Injectable()
export class StakingCollectionService {
    constructor(
        @InjectModel(StakingCollection.name)
        private stakingCollectionModel: Model<StakingCollectionDocument>,
        @InjectModel(Post.name)
        public postModel: Model<PostDocument>
    ) {}

    async create(
        createStakingCollectionInput: CreateStakingCollectionInput,
        userId: Types.ObjectId
    ): Promise<StakingCollection> {
        const createdStakingCollection = new this.stakingCollectionModel(
            createStakingCollectionInput
        );
        const post = await new this.postModel({
            staking: createdStakingCollection._id,
            author: userId
        });

        createdStakingCollection.post = post?._id;
        post.save();
        return createdStakingCollection.save();
    }

    async findAll(query: StakingFilterInput): Promise<StakingCollection[]> {
        const filters: FilterQuery<StakingCollectionDocument> = {};
        if (query?.keyword) {
            const keywordRegex = new RegExp(query.keyword, 'i');
            filters.$or = [
                { collectionName: { $regex: keywordRegex } },
                { category: { $regex: keywordRegex } },
                { utility: { $regex: keywordRegex } },
                { metaverse: { $regex: keywordRegex } }
            ];
        }
        if (query?.chainId) {
            filters.chainId = query?.chainId;
        }
        if (query?.status) {
            filters.$or = query.status.map((item) => {
                return item === Status.UPCOMING
                    ? { startedAt: { $gte: new Date() } }
                    : { startedAt: { $lte: new Date() } };
            });
        }
        if (query?.category) {
            filters.category = { $in: query.category };
        }

        return this.stakingCollectionModel.find(filters).exec();
    }

    async findOne(id: Types.ObjectId): Promise<StakingCollection> {
        return this.stakingCollectionModel.findById(id).exec();
    }

    async update(
        id: string,
        updateStakingCollectionInput: UpdateStakingCollectionInput
    ): Promise<StakingCollection> {
        return this.stakingCollectionModel
            .findByIdAndUpdate(id, updateStakingCollectionInput, { new: true })
            .exec();
    }

    async remove(id: string): Promise<StakingCollection> {
        return this.stakingCollectionModel.findByIdAndRemove(id).exec();
    }
}
