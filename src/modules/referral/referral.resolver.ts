import {
    Resolver,
    Query,
    Mutation,
    Context,
    Args,
    ResolveField,
    Parent
} from '@nestjs/graphql';
import { ReferralService } from './referral.service';
import { Referral } from './entities/referral.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ContextProps } from 'src/interfaces/common.interface';
import {
    CreateReferralOutput,
    ReferralsOutput,
    UpdateWithdrawRequestStatusInput,
    UserReferrals,
    UserRewards
} from './dto/create-referral.input';
import { User, UserDocument } from '../users/entities/user.entity';
import { WithdrawRequest } from './entities/withdraw.requests.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AdminGuard } from '../admin/admin.guard';
import { Types } from 'mongoose';

@Resolver(() => Referral)
export class ReferralResolver {
    constructor(private readonly referralService: ReferralService) {}

    @ResolveField(() => WithdrawRequest)
    async userId(@Parent() request: WithdrawRequest) {
        return this.referralService.withdrawRequestModel.findById(
            request?.userId
        );
    }

    @Mutation(() => CreateReferralOutput)
    @UseGuards(AuthGuard)
    createReferral(
        @Context() ctx: ContextProps
    ): Promise<CreateReferralOutput> {
        const { _id: userId } = ctx.req.user;
        return this.referralService.create(userId);
    }

    @Query(() => ReferralsOutput)
    @UseGuards(AuthGuard)
    affiliatedData(
        @Args('duration') duration: string,
        @Context() ctx: ContextProps
    ): Promise<ReferralsOutput> {
        const { _id: userId } = ctx.req.user;
        return this.referralService.get(userId, duration);
    }

    @Query(() => [UserReferrals])
    @UseGuards(AuthGuard)
    userReferrals(@Context() ctx: ContextProps): Promise<UserDocument[]> {
        const { _id: userId } = ctx.req.user;
        return this.referralService.userReferrals(userId);
    }

    @Query(() => UserRewards)
    @UseGuards(AuthGuard)
    userRewards(@Context() ctx: ContextProps): Promise<UserDocument[]> {
        const { _id: userId } = ctx.req.user;
        return this.referralService.userRewards(userId);
    }

    @Query(() => [WithdrawRequest])
    @UseGuards(AdminGuard)
    getAllWithdrawRequests(): Promise<WithdrawRequest[]> {
        return this.referralService.getAllWithdrawRequests();
    }

    @Mutation(() => WithdrawRequest)
    @UseGuards(AuthGuard)
    async requestWithdraw(
        @Args('amount') amount: number,
        @Args('address') address: string,
        @CurrentUser() user: User
    ): Promise<WithdrawRequest> {
        return this.referralService.createWithdrawRequest(
            user.id,
            address,
            amount
        );
    }

    @Mutation(() => WithdrawRequest)
    async updateWithdrawRequestStatus(
        @Args('updateWithdrawRequestStatusData')
        updateWithdrawRequestStatusData: UpdateWithdrawRequestStatusInput
    ): Promise<WithdrawRequest> {
        return this.referralService.updateStatus(
            new Types.ObjectId(updateWithdrawRequestStatusData.requestId),
            updateWithdrawRequestStatusData.newStatus
        );
    }
}
