import {
    Resolver,
    Query,
    Mutation,
    Args,
    Int,
    Context,
    ResolveField,
    Parent
} from '@nestjs/graphql';
import { UsersService } from './users.service';
// import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { User, UserDocument } from './entities/user.entity';
import {
    UseInterceptors,
    UseGuards,
    BadRequestException
} from '@nestjs/common';
import { GraphqlCacheInterceptor } from 'src/interceptors/graphql-cache.interceptor';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ContextProps } from 'src/interfaces/common.interface';
import {
    ContentCreatorStats,
    Leader,
    ProfileInput,
    SearchResult,
    SettingsInput,
    VerifyEmailOutput
} from './dto/users.input';
import { Types } from 'mongoose';
import { Hashtag, HashtagDocument } from '../feeds/entities/hashtag.entity';
import { HashtagsService } from '../feeds/hashtags.service';
import { Wallet, WalletDocument } from './entities/wallet.entity';
import { AdminGuard } from '../admin/admin.guard';
import { UserRefetchResult } from './entities/user-settings.entity';
import { SuccessPayload } from '../admin/dto/create-admin.input';
import { Role } from '../admin/role.decorator';
import { HashtagCount } from '../feeds/entities/hashcount.entity';
import {
    CollectionDocument,
    LinkPreview
} from '../collections/entities/collection.entity';
// import { RestrictGuard } from 'src/helpers/restrict.fields.guard';

@ApiTags('users')
@Resolver(() => User)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService,
        private readonly hashtagsService: HashtagsService
    ) {}

    @ResolveField(() => User)
    async userId(@Parent() wallet: Wallet): Promise<UserDocument> {
        return this.usersService.findById(wallet?.userId);
    }

    @ResolveField(() => String)
    async wallet(@Parent() user: User): Promise<string> {
        const wallets = await this.usersService.findWalletsByUserId(user._id);
        return wallets.length ? wallets[0].address : '';
    }

    @ResolveField(() => String)
    async wallets(@Parent() user: User): Promise<WalletDocument[]> {
        const wallets = await this.usersService.findWalletsByUserId(user._id);
        return wallets;
    }

    @ResolveField(() => [User])
    async followers(@Parent() user: User): Promise<UserDocument[]> {
        return this.usersService.findAll(
            { _id: { $in: user.followers } },
            true
        );
    }

    @ResolveField(() => [User])
    async blockedBy(@Parent() user: User): Promise<UserDocument[]> {
        return this.usersService.findAll({ _id: { $in: user.blockedBy } });
    }

    @ResolveField(() => [User])
    async blockedUsers(@Parent() user: User): Promise<UserDocument[]> {
        return this.usersService.findAll(
            { _id: { $in: user.blockedUsers } },
            true
        );
    }

    @ResolveField(() => [User])
    async following(@Parent() user: User): Promise<UserDocument[]> {
        return this.usersService.findAll(
            { _id: { $in: user.following } },
            true
        );
    }

    @ResolveField(() => [Hashtag])
    async followingHashtags(@Parent() user: User): Promise<HashtagDocument[]> {
        return this.hashtagsService.findAll({
            _id: { $in: user.followingHashtags }
        });
    }
    @Mutation(() => User)
    createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
        return this.usersService.create(createUserInput);
    }

    // ----------------- MOVED TO FEED RESOLOVER

    // @UseGuards(AuthGuard)
    // @Mutation(() => User)
    // follow(
    //     @Context() context: ContextProps,
    //     @Args('id', { type: () => String }) id: string
    // ) {
    //     const { _id: userId } = context.req.user;
    //     return this.usersService.follow(id, userId);
    // }

    @UseGuards(AuthGuard)
    @Mutation(() => [User])
    myFollowers(@Context() ctx: ContextProps) {
        const { _id: userId } = ctx.req.user;
        return this.usersService.ownFollowersUsers(userId);
    }

    @Query(() => [User], { name: 'users' })
    @UseInterceptors(GraphqlCacheInterceptor)
    findAll(): Promise<UserDocument[]> {
        return this.usersService.findAll({}, true);
    }

    @Query(() => User, { name: 'user' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.usersService.findOne({ _id: id }, true);
    }

    @Mutation(() => User)
    removeUser(@Args('id', { type: () => Int }) id: number) {
        return this.usersService.remove(id);
    }

    // ------------ SETTINGS ------------

    @Mutation(() => VerifyEmailOutput)
    @UseGuards(AuthGuard)
    async changeSettings(
        @Context() ctx: ContextProps,
        @Args('data') data: SettingsInput
    ) {
        const response = await this.usersService.changeSettings(
            ctx.req.user._id,
            data
        );
        if (response) return response;
        throw new BadRequestException('Could not change settings');
    }

    @Mutation(() => Wallet)
    @UseGuards(AuthGuard)
    async addWallet(
        @Context() ctx: ContextProps,
        @Args('signature') signature: string
    ) {
        const response = await this.usersService.addWallet(
            ctx.req.user._id,
            signature
        );
        if (response) return response;
        throw new BadRequestException('Could not change settings');
    }

    @Mutation(() => Wallet)
    @UseGuards(AuthGuard)
    async setPrimaryWallet(
        @Context() ctx: ContextProps,
        @Args('walletId') walletId: string
    ) {
        return this.usersService.setPrimaryWallet(
            ctx.req.user._id,
            new Types.ObjectId(walletId)
        );
    }

    @Mutation(() => Wallet)
    @UseGuards(AuthGuard)
    async deleteWallet(
        @Context() ctx: ContextProps,
        @Args('walletId') walletId: string
    ) {
        const response = await this.usersService.deleteWallet(
            ctx.req.user._id,
            walletId
        );
        if (response) return response;
        throw new BadRequestException('Could not change settings');
    }

    // ------------ SEARCH ------------

    @Query(() => [User])
    @UseGuards(AuthGuard)
    async searchUsers(
        @Context() ctx: ContextProps,
        @Args('query') query: string,
        @Args('groupId', { type: () => String, nullable: true })
        groupId?: string
    ): Promise<User[]> {
        const loggedUserId = ctx.req.user._id;
        return this.usersService.searchUsers(query, loggedUserId, groupId);
    }

    // ------------ USER PROFILE ------------

    @Query(() => User, { nullable: true })
    @UseGuards(AuthGuard)
    // @UseGuards(new RestrictGuard(['password']))
    async userProfile(
        @Args('userName', { type: () => String }) userName: string
    ): Promise<User> {
        return this.usersService.findOne({ userName }, true);
    }

    @Query(() => [Wallet], { name: 'wallets' })
    async findWalletsByUserId(
        @Args('userId', { type: () => String }) userId: string
    ): Promise<WalletDocument[]> {
        return this.usersService.findWalletsByUserId(
            new Types.ObjectId(userId)
        );
    }

    @Mutation(() => User)
    @UseGuards(AuthGuard)
    async editProfile(
        @Context() ctx: ContextProps,
        @Args('data') data: ProfileInput
    ): Promise<User> {
        const { _id: userId } = ctx.req.user;
        return this.usersService.editProfile(userId, data);
    }

    @Mutation(() => UserRefetchResult)
    @UseGuards(AuthGuard)
    async refetchUser(
        @Context() ctx: ContextProps
    ): Promise<UserRefetchResult> {
        const { _id: userId } = ctx.req.user;
        return this.usersService.refetchUser(userId);
    }

    @Mutation(() => User)
    @UseGuards(AuthGuard)
    async blockUser(
        @Args('targetUserId') targetUserId: string,
        @Context() ctx: ContextProps
    ): Promise<User> {
        const { _id: userId } = ctx.req.user;
        return await this.usersService.blockUser(
            userId,
            new Types.ObjectId(targetUserId)
        );
    }

    @Mutation(() => User)
    @UseGuards(AuthGuard)
    async unblockUser(
        @Args('targetUserId') targetUserId: string,
        @Context() ctx: ContextProps
    ): Promise<User> {
        const { _id: userId } = ctx.req.user;
        return await this.usersService.unblockUser(
            userId,
            new Types.ObjectId(targetUserId)
        );
    }

    @Query(() => Wallet, { name: 'wallet', nullable: true })
    async getUserByWalletAddress(
        @Args('address') address: string
    ): Promise<WalletDocument> {
        return this.usersService.getUserByWalletAddress(address);
    }

    // --------- GLOBAL SEARCH ------------

    @Query(() => SearchResult)
    async search(@Args('search') search: string): Promise<{
        users: UserDocument[];
        hashtags: HashtagDocument[];
        hashtagCount: HashtagCount[];
        collections: CollectionDocument[];
    }> {
        return this.usersService.globalSearch(search);
    }

    // ------------ ADD WALLET ------------

    @Mutation(() => Wallet)
    @UseGuards(AuthGuard)
    async adddWallet(
        @Args('signature') signature: string,
        @Context() ctx: ContextProps
    ): Promise<WalletDocument> {
        const { _id: userId } = ctx.req.user;
        return this.usersService.addWallet(userId, signature);
    }

    @Query(() => [User])
    @UseGuards(AuthGuard)
    async ownBlockedUsers(@Context() ctx: ContextProps): Promise<User[]> {
        const loggedUserId = ctx.req.user._id;
        return this.usersService.ownBlockedUsers(loggedUserId);
    }

    // ------------ CONETNT CREATER ------------

    @Query(() => ContentCreatorStats)
    @UseGuards(AuthGuard)
    async contentCreatorStats(@Context() ctx: ContextProps) {
        const { _id: userId } = ctx.req.user;
        return this.usersService.contentCreatorStats(userId);
    }

    @Mutation(() => SuccessPayload)
    @UseGuards(AuthGuard)
    async applyForSCCApprovel(@Context() ctx: ContextProps) {
        const { _id: userId } = ctx.req.user;
        const res = await this.usersService.applyForSCCApprovel(userId);
        if (res) return res;
        throw new BadRequestException(
            'You cannot apply for Content Creater Badge'
        );
    }

    @Query(() => [User])
    @UseGuards(AdminGuard)
    @Role('admin')
    async SCCAppliedUsers(): Promise<UserDocument[]> {
        return this.usersService.SCCAppliedUsers();
    }

    @Mutation(() => SuccessPayload)
    @UseGuards(AdminGuard)
    @Role('admin')
    async SCCApprovel(
        @Args('userId', { type: () => String }) userId: Types.ObjectId
    ): Promise<SuccessPayload> {
        const res = await this.usersService.SCCApprovel(userId);
        if (res) return res;
        throw new BadRequestException(
            'This user is not able for Content Creater Badge'
        );
    }

    @Query(() => LinkPreview, { name: 'userLinkPreview', nullable: true })
    userLinkPreview(
        @Args('userName', { type: () => String }) userName: string
    ) {
        return this.usersService.getLinkPreview(userName);
    }

    @Query(() => [Leader], { name: 'leaders', nullable: true })
    getLeaders() {
        return this.usersService.getLeaders();
    }
}
