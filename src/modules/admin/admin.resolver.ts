import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';
import {
    UsersDataOverview,
    UsersDataOutput,
    SuccessPayload,
    AffiliateStats,
    AffiliateUsers,
    SingleUserGraphOutput,
    ProfileInputAdmin
    // AffiliateStats
} from './dto/create-admin.input';
import { AdminGuard } from './admin.guard';
import { UseGuards } from '@nestjs/common';
import { Role } from './role.decorator';
@UseGuards(AdminGuard)
@Role('admin')
@Resolver(() => Admin)
export class AdminResolver {
    constructor(private readonly adminService: AdminService) {}

    // ------- Overview Section -------

    @UseGuards(AdminGuard)
    @Role('admin')
    @Query(() => UsersDataOverview)
    async usersStats(): Promise<UsersDataOverview> {
        return this.adminService.usersStats();
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Query(() => [SingleUserGraphOutput])
    async usersGraphStats(): Promise<SingleUserGraphOutput[]> {
        return this.adminService.usersGraphStats();
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Query(() => UsersDataOverview)
    async todayUsersStats(): Promise<UsersDataOverview> {
        return this.adminService.todayUsersStats();
    }

    // ------- User Section -------

    @UseGuards(AdminGuard)
    @Role('admin')
    @Query(() => UsersDataOutput)
    async usersData(
        @Args('page') page: number,
        @Args('filter', { nullable: true }) filter: string,
        @Args('search', { nullable: true }) search: string
    ): Promise<UsersDataOutput> {
        return this.adminService.usersData(page, filter, search);
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => SuccessPayload)
    async blockUserByAdmin(
        @Args('id') id: string,
        @Args('status') status: boolean
    ): Promise<SuccessPayload> {
        return this.adminService.blockUserByAdmin(id, status);
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => SuccessPayload)
    async banUserByAdmin(
        @Args('id') id: string,
        @Args('status') status: boolean
    ): Promise<SuccessPayload> {
        return this.adminService.banUserByAdmin(id, status);
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => SuccessPayload)
    async editProfileByAdmin(
        @Args('id') id: string,
        @Args('data') data: ProfileInputAdmin
    ): Promise<SuccessPayload> {
        return this.adminService.editProfileAdmin(id, data);
    }

    // ------- Affiliate -------

    @UseGuards(AdminGuard)
    @Role('admin')
    @Query(() => AffiliateStats)
    async affiliateStats(): Promise<AffiliateStats> {
        return this.adminService.affiliateStats();
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Query(() => [AffiliateUsers])
    async affiliateUsers(
        @Args('search', { nullable: true }) search: string
    ): Promise<AffiliateUsers[]> {
        return this.adminService.affiliateUsers(search);
    }

    // --------- Reports ----------------
}
