import {
    Resolver,
    Query,
    Mutation,
    Args,
    Int,
    ResolveField,
    Parent
} from '@nestjs/graphql';
import { ActivityService } from './activities.service';
import { Activity, ActivityDocument } from './entities/activities.entity';
import { CreateActivityInput } from './dto/create-activities.input';
import {
    ActivityFilterInput,
    UpdateActivityInput
} from './dto/update-activities.input';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from '../users/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from '../feeds/entities/post.entity';
import { CollectionDocument } from '../collections/entities/collection.entity';
import { COLLECTIONS } from 'src/constants/db.collections';

@Resolver(() => Activity)
export class ActivityResolver {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        @InjectModel(Post.name)
        private postModel: Model<PostDocument>,
        @InjectModel(COLLECTIONS)
        private collectionModel: Model<CollectionDocument>,
        private readonly activityService: ActivityService
    ) {}

    @Mutation(() => Activity)
    createActivity(
        @Args('createActivityInput')
        createActivityInput: CreateActivityInput
    ) {
        return this.activityService.create(createActivityInput);
    }

    @ResolveField(() => Activity)
    async user(@Parent() activity: Activity) {
        return this.userModel.findById(activity?.user);
    }

    @ResolveField(() => Activity)
    async post(@Parent() activity: Activity) {
        return this.postModel.findById(activity?.post);
    }

    @ResolveField(() => Activity)
    async nftCollection(@Parent() activity: Activity) {
        return this.collectionModel.findById(activity?.nftCollection);
    }

    @Query(() => [Activity], { name: 'activities' })
    findAll(
        @Args('query', { type: () => ActivityFilterInput, nullable: true })
        query: FilterQuery<ActivityDocument>
    ) {
        return this.activityService.findAll(query);
    }

    @Query(() => Activity, { name: 'activity' })
    findOne(@Args('id', { type: () => Int }) id: string) {
        return this.activityService.findOne(id);
    }

    @Mutation(() => Activity)
    updateActivity(
        @Args('updateActivityInput')
        updateActivityInput: UpdateActivityInput
    ) {
        return this.activityService.update(
            updateActivityInput.id,
            updateActivityInput
        );
    }

    @Mutation(() => Activity)
    removeListing(@Args('id', { type: () => String }) id: string) {
        return this.activityService.remove(id);
    }
}
