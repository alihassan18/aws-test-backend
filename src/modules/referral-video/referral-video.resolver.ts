import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReferralVideoService } from './referral-video.service';
import { ReferralVideo } from './entities/referral-video.entity';
import { CreateReferralVideoInput } from './dto/create-referral-video.input';
import { AdminGuard } from '../admin/admin.guard';
import { UseGuards } from '@nestjs/common';
import { Role } from '../admin/role.decorator';
import { Types } from 'mongoose';
import { AuthGuard } from '../auth/auth.guard';
// import { UpdateReferralVideoInput } from './dto/update-referral-video.input';

@Resolver(() => ReferralVideo)
export class ReferralVideoResolver {
    constructor(private readonly referralVideoService: ReferralVideoService) {}

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => ReferralVideo)
    createReferralVideo(
        @Args('createReferralVideoInput')
        createReferralVideoInput: CreateReferralVideoInput
    ) {
        return this.referralVideoService.create(createReferralVideoInput);
    }

    @Query(() => [ReferralVideo], { name: 'referralVideos' })
    @UseGuards(AuthGuard)
    allReferralVideos() {
        return this.referralVideoService.findAll();
    }

    @Query(() => ReferralVideo, { name: 'referralVideo' })
    @UseGuards(AuthGuard)
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.referralVideoService.findOne(id);
    }

    @Mutation(() => ReferralVideo)
    updateReferralVideo() {
        // updateReferralVideoInput: UpdateReferralVideoInput // @Args('updateReferralVideoInput')
        // return this.referralVideoService.update(updateReferralVideoInput.id, updateReferralVideoInput);
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => ReferralVideo)
    removeReferralVideo(
        @Args('id', { type: () => String }) id: Types.ObjectId
    ) {
        return this.referralVideoService.remove(id);
    }
}
