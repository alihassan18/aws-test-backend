import { InputType, Int, Field, ObjectType, ID } from '@nestjs/graphql';

@InputType()
export class CreateAdminInput {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number;
}

@ObjectType()
export class UsersDataOverview {
    @Field(() => Number, { nullable: true })
    usersCount?: number;

    @Field(() => Number, { nullable: true })
    kycCount?: number;

    @Field(() => Number, { nullable: true })
    postsCount?: number;

    @Field(() => Number, { nullable: true })
    contentCreators?: number;

    @Field(() => Number, { nullable: true })
    blockedUsersCount?: number;

    @Field(() => Number, { nullable: true })
    bannedUsersCount?: number;

    @Field(() => Number, { nullable: true })
    hashtagCount?: number;

    @Field(() => Number, { nullable: true })
    groupsCount?: number;

    @Field(() => Number, { nullable: true })
    sharedPosts?: number;

    @Field(() => Number, { nullable: true })
    repostsCount?: number;

    @Field(() => Number, { nullable: true })
    commentsCount?: number;

    @Field(() => Number, { nullable: true })
    likeCount?: number;

    @Field(() => Number, { nullable: true })
    stageCount?: number;
}

@ObjectType()
export class SingleUserGraphOutput {
    @Field(() => String)
    date: string;

    @Field(() => Number)
    count: number;
}

@ObjectType()
export class UsersGraphOutput {
    @Field(() => [SingleUserGraphOutput])
    result: [SingleUserGraphOutput];
}

@ObjectType()
export class SingleUsersDataOutput {
    @Field(() => ID)
    _id: string;

    @Field()
    userName: string;

    @Field(() => Number, { nullable: true })
    followersCount: number;

    @Field(() => Number, { nullable: true })
    followingCount: number;

    @Field(() => Number, { nullable: true })
    points: number;

    @Field(() => String, { nullable: true })
    avatar: string;

    @Field(() => Boolean, { nullable: true })
    isVerified: boolean;

    @Field(() => Boolean, { nullable: true })
    isBlocked: boolean;

    @Field(() => Boolean, { nullable: true })
    isBanned: boolean;

    @Field(() => Boolean, { nullable: true })
    isSCC: boolean;

    @Field(() => Number, { nullable: true })
    postCount: number;

    @Field(() => Number, { nullable: true })
    repostCount: number;

    @Field(() => Number, { nullable: true })
    commentCount: number;

    @Field(() => Number, { nullable: true })
    likeCount: number;

    @Field(() => Number, { nullable: true })
    listedNFTs: number;

    @Field(() => Number, { nullable: true })
    soldNFTs: number;

    @Field(() => Number, { nullable: true })
    boughtNFTs: number;

    @Field(() => Number, { nullable: true })
    mintedNFTs: number;

    @Field(() => Date, { nullable: true })
    createdAt: Date;
}

@ObjectType()
export class UsersDataOutput {
    @Field(() => Number, { nullable: true })
    pageSize?: number;

    @Field(() => Number, { nullable: true })
    currentPage?: number;

    @Field(() => Boolean, { nullable: true })
    next?: boolean;

    @Field(() => [SingleUsersDataOutput])
    data: SingleUsersDataOutput[];
}

@ObjectType()
export class SuccessPayload {
    @Field(() => String, { nullable: true })
    message?: string;

    @Field(() => Boolean, { nullable: true })
    success: boolean;
}

@ObjectType()
export class AffiliateStats {
    @Field(() => Number, { nullable: true })
    affiliatedUsersCount?: number;

    @Field(() => Number, { nullable: true })
    referralUsers?: number;

    @Field(() => Number, { nullable: true })
    referralVideos?: number;
}

@ObjectType()
export class AffiliateUsers {
    @Field(() => ID)
    _id: string;

    @Field()
    userName: string;

    @Field(() => Int, { nullable: true })
    followersCount: number;

    @Field(() => Int, { nullable: true })
    followingCount: number;

    @Field(() => Boolean, { nullable: true })
    isVerified: boolean;

    @Field(() => Boolean, { nullable: true })
    isBlocked: boolean;

    @Field(() => Boolean, { nullable: true })
    isBanned: boolean;

    @Field(() => Boolean, { nullable: true })
    isSCC: boolean;

    @Field(() => String, { nullable: true })
    avatar: string;

    @Field(() => Int, { nullable: true })
    referralCount: number;

    @Field(() => Int, { nullable: true })
    referralLevel: number;

    @Field(() => Int, { nullable: true })
    commissionPercentage: number;

    @Field(() => Int, { nullable: true })
    videoShared: number;
}

@InputType()
export class ProfileInputAdmin {
    @Field(() => Boolean, { nullable: true })
    isVerified?: boolean;

    @Field(() => Boolean, { nullable: true })
    isSCC?: boolean;

    @Field(() => String, { nullable: true })
    verifyStatus?: string;

    @Field(() => String, { nullable: true })
    scc_status?: string;
}
