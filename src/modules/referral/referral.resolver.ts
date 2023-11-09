import { Resolver, Query, Mutation, Context, Args } from '@nestjs/graphql';
import { ReferralService } from './referral.service';
import { Referral } from './entities/referral.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ContextProps } from 'src/interfaces/common.interface';
import {
    CreateReferralOutput,
    ReferralsOutput,
    UserReferrals,
    UserRewards
} from './dto/create-referral.input';
import { User, UserDocument } from '../users/entities/user.entity';
import { WithdrawRequest } from './entities/withdraw.requests.entity';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@Resolver(() => Referral)
export class ReferralResolver {
    constructor(private readonly referralService: ReferralService) {}

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

    @Mutation(() => WithdrawRequest)
    @UseGuards(AuthGuard)
    async requestWithdraw(
        @Args('amount') amount: number,
        @CurrentUser() user: User
    ): Promise<WithdrawRequest> {
        return this.referralService.createWithdrawRequest(user.id, amount);
    }
}
