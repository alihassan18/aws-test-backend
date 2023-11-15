import {
    Resolver,
    Query,
    Mutation,
    Args,
    ResolveField,
    Parent
} from '@nestjs/graphql';
import { ReferralService } from './referral.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateWithdrawRequestStatusInput } from './dto/create-referral.input';
import { User } from '../users/entities/user.entity';
import { WithdrawRequest } from './entities/withdraw.requests.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { AdminGuard } from '../admin/admin.guard';
import { Types } from 'mongoose';

@Resolver(() => WithdrawRequest)
export class WithdrawRequestResolver {
    constructor(private readonly referralService: ReferralService) {}

    @ResolveField(() => WithdrawRequest)
    async userId(@Parent() request: WithdrawRequest) {
        return this.referralService.userService.userModel.findById(
            request?.userId
        );
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
