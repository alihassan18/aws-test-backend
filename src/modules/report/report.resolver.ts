import {
    Resolver,
    Mutation,
    Args,
    Context,
    Query,
    ResolveField,
    Parent
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ContextProps } from 'src/interfaces/common.interface';
import { Report, ReportDocument } from './report.entity';
import { ReportService } from './report.service';
import { CreateReportDto } from './report.dto';
import { AdminGuard } from '../admin/admin.guard';
import { Role } from '../admin/role.decorator';
import { User, UserDocument } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Post, PostDocument } from '../feeds/entities/post.entity';
import { Types } from 'mongoose';
import { PostService } from '../feeds/posts.service';
import { SuccessPayload } from '../admin/dto/create-admin.input';
import { NftsService } from '../nfts/nfts.service';
import { CollectionsService } from '../collections/collections.service';
@Resolver(() => Report)
export class ReportResolver {
    constructor(
        private readonly reportService: ReportService,
        private readonly userService: UsersService,
        private readonly postService: PostService,
        private readonly nftService: NftsService,
        private readonly collectionService: CollectionsService
    ) {}

    // @Query(() => [Report])
    // async reactions(
    //     @Args('targetType') targetType: 'post' | 'comment',
    //     @Args('targetId') targetId: string,
    //     @Args('limit', { type: () => Number }) limit?: number,
    //     @Args('cursor', { type: () => String, nullable: true }) cursor?: string
    // ): Promise<{ reactions: ReportDocument[]; endCursor: string }> {
    //     return await this.reactionService.getReactionsWithCursor(
    //         targetType,
    //         new Types.ObjectId(targetId),
    //         limit,
    //         cursor
    //     );
    // }

    @ResolveField(() => User)
    async user(@Parent() report: Report): Promise<UserDocument> {
        return this.userService.findById(report.user);
    }

    @ResolveField(() => User)
    async reportedBy(@Parent() report: Report): Promise<UserDocument> {
        return this.userService.findById(report.reportedBy);
    }

    @ResolveField(() => Post)
    async post(@Parent() report: Report): Promise<PostDocument> {
        return this.postService.findById(new Types.ObjectId(report?.post));
    }

    // @ResolveField(() => Nft)
    // async nft(@Parent() report: Report): Promise<NftDocument> {
    //     return this.nftService.findById(new Types.ObjectId(report?.nft));
    // }

    // @ResolveField(() => Collection)
    // async _collection(@Parent() report: Report): Promise<CollectionDocument> {
    //     return this.collectionService.findById(
    //         new Types.ObjectId(report?._collection)
    //     );
    // }

    @UseGuards(AuthGuard)
    @Mutation(() => Report)
    async createReport(
        @Args('data') data: CreateReportDto,
        @Context() context: ContextProps
    ): Promise<ReportDocument> {
        const { _id: userId } = context.req.user;
        return await this.reportService.create(data, userId);
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => SuccessPayload)
    async resolveReport(
        @Args('id', { type: () => String }) id: Types.ObjectId
    ): Promise<SuccessPayload> {
        return await this.reportService.resolveReport(id);
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Query(() => [Report])
    async getUsersReports(): Promise<ReportDocument[]> {
        return this.reportService.getUsersReports();
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Query(() => [Report])
    async getPostReports(): Promise<ReportDocument[]> {
        return this.reportService.getPostReports();
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Query(() => [Report])
    async getNftsReports(): Promise<ReportDocument[]> {
        return this.reportService.getNftsReports();
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Query(() => [Report])
    async getCollectionsReports(): Promise<ReportDocument[]> {
        return this.reportService.getCollectionsReports();
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Query(() => [Report])
    async getlandsReports(): Promise<ReportDocument[]> {
        return this.reportService.getlandsReports();
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => SuccessPayload)
    async removeCollection(
        @Args('id', { type: () => String }) id: Types.ObjectId
    ): Promise<SuccessPayload> {
        return this.reportService.blockReportedCollection(id);
        //  this.collectionService.removeCollection(id);
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => SuccessPayload)
    async removeNFT(
        @Args('id', { type: () => String }) id: Types.ObjectId
    ): Promise<SuccessPayload> {
        return this.reportService.blockReportedNft(id);
    }

    @UseGuards(AuthGuard)
    @Query(() => SuccessPayload)
    async isNFTBlocked(
        @Args('contract', { type: () => String }) contract: string,
        @Args('chain', { type: () => String }) chain: string,
        @Args('tokenId', { type: () => String }) tokenId: string
    ): Promise<SuccessPayload> {
        return this.reportService.isNFTBlocked(contract, chain, tokenId);
    }

    @UseGuards(AuthGuard)
    @Query(() => SuccessPayload)
    async isCollectionBlocked(
        @Args('contract', { type: () => String }) contract: string,
        @Args('chain', { type: () => String }) chain: string
    ): Promise<SuccessPayload> {
        return this.reportService.isCollectionBlocked(contract, chain);
    }
}
