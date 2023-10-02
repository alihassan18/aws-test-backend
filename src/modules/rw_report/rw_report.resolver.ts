import {
    Resolver,
    Query,
    Mutation,
    Args,
    Context,
    ResolveField,
    Parent
} from '@nestjs/graphql';
import { RwReportService } from './rw_report.service';
import { RwReport } from './entities/rw_report.entity';
import { CreateRwReportInput } from './dto/create-rw_report.input';
import { AuthGuard } from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { ContextProps } from 'src/interfaces/common.interface';
import { AdminGuard } from '../admin/admin.guard';
import { Role } from '../admin/role.decorator';
import { Types } from 'mongoose';
import {
    RwUsersMedia,
    RwUsersMediaDocument
} from '../rw_users_media/entities/rw_users_media.entity';
import { RwUsersMediaService } from '../rw_users_media/rw_users_media.service';

@Resolver(() => RwReport)
export class RwReportResolver {
    constructor(
        private readonly rwReportService: RwReportService,
        private readonly rwUsersMediaService: RwUsersMediaService
    ) {}

    @Mutation(() => RwReport)
    @UseGuards(AuthGuard)
    rw_reportCreate(
        @Args('createRwReportInput') createRwReportInput: CreateRwReportInput,
        @Context() ctx: ContextProps
    ) {
        const { _id } = ctx.req.user;
        const payload = {
            ...createRwReportInput,
            ...(createRwReportInput.mediaId && {
                mediaId: new Types.ObjectId(createRwReportInput.mediaId)
            })
        };
        return this.rwReportService.create(payload, _id);
    }

    @ResolveField(() => RwUsersMedia)
    async user(@Parent() rwReport: RwReport): Promise<RwUsersMediaDocument> {
        return this.rwUsersMediaService.findById(rwReport.mediaId);
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Query(() => [RwReport])
    rw_reports() {
        return this.rwReportService.findAll();
    }

    @Query(() => RwReport)
    @UseGuards(AuthGuard)
    rw_reportsUsers(@Context() ctx: ContextProps) {
        const { _id } = ctx.req.user;
        return this.rwReportService.usersReports(_id);
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => RwReport)
    rw_reportResolve(@Args('id', { type: () => String }) id: Types.ObjectId) {
        return this.rwReportService.remove(id);
    }
}
