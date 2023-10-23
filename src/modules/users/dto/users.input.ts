import { InputType, Field, ObjectType, Int } from '@nestjs/graphql';
import mongoose from 'mongoose';
import { User } from '../entities/user.entity';
import { MinLength, MaxLength, Matches } from 'class-validator';
import { Hashtag } from 'src/modules/feeds/entities/hashtag.entity';
import { HashtagCount } from 'src/modules/feeds/entities/hashcount.entity';
import { Collection } from 'src/modules/collections/entities/collection.entity';
import { Post } from 'src/modules/feeds/entities/post.entity';
@InputType()
export class CreateUserInput {
    @Field(() => String)
    email: string;
    @Field(() => String)
    password: string;
}

@InputType()
export class LoginUserInput {
    @Field(() => String, { nullable: true })
    email?: string;

    @Field(() => String, { nullable: true })
    password?: string;

    // password protection
    // @Field(() => String, { nullable: true })
    // code?: string;
}

@InputType()
export class SignInInput {
    @Field(() => String, { nullable: true })
    email: string;

    @Field(() => String)
    @MinLength(8)
    @MaxLength(20)
    // @Matches(
    //     /(?=^.{8,}$)(?=.*\d)(?=.*[!$%^&()_+|~=`{}\[\]:";'<>?,.#@*-\/\\]*)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    //     {
    //         message: 'Password too weak.'
    //     }
    // )
    password: string;

    @Field(() => String, { nullable: true })
    firstName?: string;

    @Field(() => String, { nullable: true })
    lastName?: string;

    @Matches(/^[A-Za-z0-9_-]+$/, {
        message: 'You cannot use special characters except - and _'
    })
    @Field(() => String, { nullable: true })
    userName?: string;

    @Field(() => String, { nullable: true })
    phoneNumber?: string;

    @Field(() => String, { nullable: true })
    avatar?: string;

    @Field(() => String, { nullable: true })
    referral?: mongoose.Types.ObjectId;

    @Field(() => Boolean, { nullable: true })
    isRuffyWorldUser?: boolean;

    @Field(() => Boolean, { nullable: true })
    isComedian?: boolean;

    @Field(() => Boolean, { nullable: true })
    isTeacher?: boolean;
}

@InputType()
export class UpdatePasswordInput {
    @Field(() => String)
    oldPassword: string;
    @Field(() => String)
    newPassword: string;
}

@InputType()
export class UpdateUserInput {
    @Field(() => String)
    username?: string;
    @Field(() => String)
    email?: string;
    password?: UpdatePasswordInput;
    @Field(() => Boolean)
    enabled?: boolean;
}

@ObjectType()
export class LoginResult {
    @Field(() => User, { nullable: true })
    user: User;
    @Field(() => String, { nullable: true })
    access_token: string;

    @Field(() => Boolean, { nullable: true })
    twoFa?: boolean;
    // password protection
    @Field(() => Boolean, { nullable: true })
    notAffiliated?: boolean;
}

@ObjectType()
export class RWLoginResult {
    @Field(() => User, { nullable: true })
    user: User;
    @Field(() => String, { nullable: true })
    access_token: string;
}

@ObjectType()
export class SignOutResult {
    // @Field(() => LoginResult, { nullable: true })
    // user?: LoginResult;

    @Field(() => String, { nullable: true })
    message?: string;

    @Field(() => String, { nullable: true })
    access_token?: string;
}

@ObjectType()
export class EmailSentResult {
    @Field(() => String)
    message: string;

    @Field(() => Boolean)
    success: boolean;

    @Field(() => Number)
    status?: number;
}

@InputType()
export class LoginGoogleInput {
    @Field(() => String, { nullable: true })
    referral?: string;

    @Field(() => String)
    token: string;
}

//------------- VERIFY CODE ----------------

@InputType()
export class VerifyCodeInput {
    @Field(() => String)
    email: string;

    @Field(() => String)
    code: string;
}

@ObjectType()
export class VerifyCodeOutput {
    @Field(() => Boolean)
    success: boolean;
}

//------------- GOOGLE LOGIN ----------------

@ObjectType()
export class Email {
    @Field(() => String, { nullable: true })
    message?: string;

    @Field(() => Boolean, { nullable: true })
    success?: boolean;
}

@ObjectType()
export class LoginGoogleOutput {
    @Field(() => User, { nullable: true })
    user: User;
    @Field(() => String, { nullable: true })
    access_token: string;
    @Field(() => String, { nullable: true })
    message?: string;

    @Field(() => Boolean, { nullable: true })
    notAffiliated?: boolean;
}

//------------- RESET PASSWORD ----------------

@InputType()
export class ResetPasswordInput {
    @Field(() => String)
    email: string;

    @Field(() => String)
    code: string;

    @Field(() => String)
    password: string;

    @Field(() => String)
    confirmPassword: string;
}

//------------- VERIFY EMAIL ----------------

@ObjectType()
export class VerifyEmailOutput {
    @Field(() => String, { nullable: true })
    message?: string;

    @Field(() => Boolean, { nullable: true })
    success?: boolean;

    @Field(() => Boolean, { nullable: true })
    status?: boolean;

    @Field(() => LoginResult, { nullable: true })
    loginResult?: LoginResult;
}

@ObjectType()
export class Verify2FAOutput {
    @Field(() => String, { nullable: true })
    message?: string;

    @Field(() => Boolean, { nullable: true })
    success?: boolean;

    @Field(() => Boolean, { nullable: true })
    status?: boolean;

    @Field(() => String, { nullable: true })
    token?: string;
}

// ----------- CHANGE SETTINGS ------------

@InputType()
export class SettingsAlertInput {
    @Field(() => Boolean, { nullable: true })
    messenger: boolean;

    @Field(() => Boolean, { nullable: true })
    bids: boolean;

    @Field(() => Boolean, { nullable: true })
    sell: boolean;

    @Field(() => Boolean, { nullable: true })
    buy: boolean;

    @Field(() => Boolean, { nullable: true })
    like: boolean;

    @Field(() => Boolean, { nullable: true })
    mint: boolean;

    @Field(() => Boolean, { nullable: true })
    comment: boolean;

    @Field(() => Boolean, { nullable: true })
    follow: boolean;

    @Field(() => Boolean, { nullable: true })
    followed_post: boolean;

    @Field(() => Boolean, { nullable: true })
    followed_comment: boolean;

    @Field(() => Boolean, { nullable: true })
    followed_repost: boolean;

    @Field(() => Boolean, { nullable: true })
    followed_mint_post: boolean;

    @Field(() => Boolean, { nullable: true })
    followed_created_collection: boolean;

    @Field(() => Boolean, { nullable: true })
    followed_listed: boolean;

    @Field(() => Boolean, { nullable: true })
    followed_sold: boolean;
}

@InputType()
export class SettingsInput {
    @Field(() => SettingsAlertInput, { nullable: true })
    alerts?: SettingsAlertInput;

    @Field(() => SettingsAlertInput, { nullable: true })
    email?: SettingsAlertInput;

    @Field(() => String, { nullable: true })
    messagePrivacy?: string;

    @Field(() => Boolean, { nullable: true })
    isLinkedInEnabled?: boolean;

    @Field(() => Boolean, { nullable: true })
    isTwitterEnabled?: boolean;

    @Field(() => Boolean, { nullable: true })
    isAutoMintEnabled?: boolean;

    @Field(() => String, { nullable: true })
    lastMintedCollection?: string;

    @Field(() => Boolean, { nullable: true })
    twoFa?: boolean;
}

// -------- EDIT PROFILE ----------------

@InputType()
export class ProfileInput {
    @Field(() => String, { nullable: true })
    firstName?: string;

    @Field(() => String, { nullable: true })
    lastName?: string;

    @Field(() => String, { nullable: true })
    userName?: string;

    @Field(() => String, { nullable: true })
    phoneNumber?: string;

    @Field(() => String, { nullable: true })
    avatar?: string;

    @Field(() => String, { nullable: true })
    coverImage?: string;

    @Field(() => Boolean, { nullable: true })
    hideWallet?: boolean;

    @Field(() => String, { nullable: true })
    wallet?: string;

    @Field(() => [String], { nullable: true })
    roles?: string[];

    @Field(() => String, { nullable: true })
    facebook?: string;

    @Field(() => String, { nullable: true })
    instagram?: string;

    @Field(() => String, { nullable: true })
    reddit?: string;

    @Field(() => String, { nullable: true })
    twitter?: string;

    @Field(() => String, { nullable: true })
    discord?: string;

    @Field(() => String, { nullable: true })
    youtube?: string;

    @Field(() => String, { nullable: true })
    tiktok?: string;

    @Field(() => String, { nullable: true })
    web?: string;

    @Field(() => String, { nullable: true })
    bio?: string;

    @Field(() => String, { nullable: true })
    country?: object;

    @Field(() => String, { nullable: true })
    backgroundTheme?: string;

    @Field(() => String, { nullable: true })
    land_id?: string;
}

@ObjectType()
export class SearchResult {
    @Field(() => [User], { nullable: true })
    users?: [User];

    @Field(() => [Hashtag], { nullable: true })
    hashtags?: [Hashtag];

    @Field(() => [HashtagCount], { nullable: true })
    hashtagCount?: [HashtagCount];

    @Field(() => [Collection], { nullable: true })
    collections?: [Collection];
}

@ObjectType()
export class EditProfileResult {
    @Field(() => User, { nullable: true })
    users?: User;
}

// CONTENT CREATER
@ObjectType()
export class CCSNfts7Day {
    @Field(() => String, { nullable: true })
    date?: string;
    @Field(() => [Post], { nullable: true })
    posts?: Post;
}
@ObjectType()
export class ContentCreatorStats {
    @Field(() => Number, { nullable: true })
    days?: number;

    @Field(() => Boolean, { nullable: true })
    isdays?: boolean;

    @Field(() => Number, { nullable: true })
    followers?: number;

    @Field(() => Boolean, { nullable: true })
    isfollowers?: boolean;

    @Field(() => Boolean, { nullable: true })
    iscollection?: boolean;

    @Field(() => Boolean, { nullable: true })
    isNFTs?: boolean;

    @Field(() => [CCSNfts7Day], { nullable: true })
    nftsLast7Days?: [CCSNfts7Day];
}

@ObjectType()
export class Leader {
    @Field(() => User, { nullable: true })
    user?: User;

    @Field(() => Int, { nullable: true })
    tokenContractCount?: number;
}
