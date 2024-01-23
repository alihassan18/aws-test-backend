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
import { CreateUserInput, UserPublicProfile } from './dto/create-user.input';
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
    ProfileInput,
    SettingsInput,
    VerifyEmailOutput
} from './dto/users.input';
import { Types } from 'mongoose';
import { UserRefetchResult } from './entities/user-settings.entity';
import { AuthService } from '../auth/auth.service';
// import { RestrictGuard } from 'src/helpers/restrict.fields.guard';

@ApiTags('users')
@Resolver(() => User)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService
    ) {}

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

    @Mutation(() => User)
    createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
        return this.usersService.create(createUserInput);
    }

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

    @Query(() => [User])
    @UseGuards(AuthGuard)
    async searchUsers(
        @Context() ctx: ContextProps,
        @Args('query') query: string
    ): Promise<User[]> {
        const loggedUserId = ctx.req.user._id;
        return this.usersService.searchUsers(query, loggedUserId);
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
        return this.authService.refetchUser(userId);
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

    @Query(() => [User])
    @UseGuards(AuthGuard)
    async ownBlockedUsers(@Context() ctx: ContextProps): Promise<User[]> {
        const loggedUserId = ctx.req.user._id;
        return this.usersService.ownBlockedUsers(loggedUserId);
    }

    @Query(() => UserPublicProfile, { nullable: true })
    getUserPublicProfile(
        @Args('userName', { type: () => String }) userName: string
    ) {
        return this.usersService.getUserPublicProfile(userName);
    }
}
