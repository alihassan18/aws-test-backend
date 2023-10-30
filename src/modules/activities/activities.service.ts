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
import { PublicFeedsGateway } from '../gateways/public/public-feeds.gateway';

@Injectable()
export class ActivityService implements OnModuleInit {
    constructor(
        @InjectModel(Activity.name)
        private activityModel: Model<ActivityDocument>,
        @InjectModel(Post.name)
        private postModel: Model<PostDocument>,
        @InjectModel(COLLECTIONS)
        private collectionModel: Model<CollectionDocument>,
        private publicFeedsGateway: PublicFeedsGateway
    ) {
        this.onCreateCollection();
        this.onMintPost();
    }

    onModuleInit() {
        console.log('init');
    }

    async onCreateCollection() {
        this.collectionModel.watch().on('change', (data) => {
            (async () => {
                if (data.operationType === 'insert') {
                    // MongoDB uses 'insert' for creation operations
                    const collection: CollectionDocument = data.fullDocument;
                    if (collection?.creator) {
                        const values = {
                            user: collection?.creator,
                            nftCollection: collection?._id,
                            type: ActivityTypes.COLLECTION_CREATED
                        };

                        const activity = await this.activityModel
                            .findOne(values)
                            .exec();
                        if (!activity) {
                            this.activityModel
                                .create(values)
                                .then(async (activity) => {
                                    const data = await this.activityModel
                                        .findById(activity?._id)
                                        .populate('user') // Populate the 'user' field
                                        .populate('post') // Populate the 'post' field
                                        .populate('nftCollection') // Populate the 'nftCollection' field
                                        .exec();

                                    this.publicFeedsGateway.emitRecentActivities(
                                        data
                                    );
                                    console.log('Activity created:', activity);
                                })
                                .catch((error) => {
                                    console.error(
                                        'Error creating activity:',
                                        error
                                    );
                                });
                        } else {
                            console.log('This activity already exists.');
                        }
                    } else {
                        console.warn('Creator not found:', data);
                    }
                }
            })();
        });
    }

    async onMintPost() {
        this.postModel.watch().on('change', (data) => {
            // Remove async from here
            (async () => {
                // Create an async IIFE (Immediately Invoked Function Expression)
                if (data.operationType === 'insert') {
                    // MongoDB uses 'insert' for creation operations
                    // const post: PostDocument = data?.fullDocument;
                    // const values = {
                    //     user: post.author,
                    //     post: post?._id,
                    //     type: ActivityTypes.NFT_MINTED
                    // };
                    // const activity = await this.activityModel
                    //     .findOne(values)
                    //     .exec();
                    // if (
                    //     !activity &&
                    //     post?.tokenData?.isMinted &&
                    //     post?.tokenData?.collectionName &&
                    //     post?.tokenData?.contract
                    // ) {
                    //     this.activityModel
                    //         .create(values)
                    //         .then((activity) => {
                    //             console.log('Activity created:', activity);
                    //         })
                    //         .catch((error) => {
                    //             console.error(
                    //                 'Error creating activity:',
                    //                 error
                    //             );
                    //         });
                    // } else {
                    //     console.log('This activity already exists.');
                    // }
                } else if (data.operationType === 'delete') {
                    const deletedPostId = data.documentKey._id; // Get the ID of the deleted post

                    // Find and remove the related activity
                    this.activityModel
                        .deleteMany({ post: deletedPostId })
                        .then((result) => {
                            console.log(
                                `Removed ${result.deletedCount} activities related to post ${deletedPostId}`
                            );
                        })
                        .catch((error) => {
                            console.error('Error removing activities:', error);
                        });
                }
            })(); // Immediately invoke the async function
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
