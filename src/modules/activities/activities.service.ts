import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Activity, ActivityDocument } from './entities/activities.entity';
import { CreateActivityInput } from './dto/create-activities.input';
import {
    ActivityFilterInput,
    UpdateActivityInput
} from './dto/update-activities.input';
import { COLLECTIONS } from 'src/constants/db.collections';
import { CollectionDocument } from '../collections/entities/collection.entity';
import { ActivityTypes } from './activities.enums';
import { Post, PostDocument } from '../feeds/entities/post.entity';

@Injectable()
export class ActivityService implements OnModuleInit {
    constructor(
        @InjectModel(Activity.name)
        private activityModel: Model<ActivityDocument>,
        @InjectModel(Post.name)
        private postModel: Model<PostDocument>,
        @InjectModel(COLLECTIONS)
        private collectionModel: Model<CollectionDocument>
    ) {}

    onModuleInit() {
        this.onCreateCollection();
        this.onPostCollection();
    }

    async onCreateCollection() {
        this.collectionModel.watch().on('change', (data) => {
            if (data.operationType === 'insert') {
                // MongoDB uses 'insert' for creation operations
                const creator = data.fullDocument?.creator;
                if (creator) {
                    this.activityModel
                        .create({
                            user: creator,
                            nftCollection: data.fullDocumen?._id,
                            type: ActivityTypes.COLLECTION_CREATED
                        })
                        .then((activity) => {
                            console.log('Activity created:', activity);
                        })
                        .catch((error) => {
                            console.error('Error creating activity:', error);
                        });
                } else {
                    console.warn('Creator not found:', data);
                }
            }
        });
    }

    async onPostCollection() {
        this.postModel.watch().on('change', (data) => {
            if (data.operationType === 'insert') {
                // MongoDB uses 'insert' for creation operations
                const post: PostDocument = data.fullDocument;

                this.activityModel
                    .create({
                        user: post.author,
                        post: post?._id,
                        type:
                            post?.tokenData && !post?.token
                                ? ActivityTypes.NFT_MINTED
                                : ActivityTypes.POST_CREATED
                    })
                    .then((activity) => {
                        console.log('Activity created:', activity);
                    })
                    .catch((error) => {
                        console.error('Error creating activity:', error);
                    });
            }
        });
    }

    async create(createActivityInput: CreateActivityInput): Promise<Activity> {
        const createdStakingCollection = new this.activityModel(
            createActivityInput
        );
        return createdStakingCollection.save();
    }

    async findAll(query: ActivityFilterInput): Promise<Activity[]> {
        const filters: FilterQuery<ActivityDocument> = {};
        if (query?.type) {
            const keywordRegex = new RegExp(query.type, 'i');
            filters.type = { $regex: keywordRegex };
        }

        return this.activityModel
            .find(filters)
            .sort({ _id: -1 })
            .limit(5)
            .exec();
    }

    async findOne(id: string): Promise<Activity> {
        return this.activityModel.findById(id).exec();
    }

    async update(
        id: string,
        updateActivityInput: UpdateActivityInput
    ): Promise<Activity> {
        return this.activityModel
            .findByIdAndUpdate(id, updateActivityInput, { new: true })
            .exec();
    }

    async remove(id: string): Promise<Activity> {
        return this.activityModel.findByIdAndRemove(id).exec();
    }
}