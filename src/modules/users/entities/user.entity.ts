import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { COLLECTIONS } from 'src/constants/db.collections';
import { ESource } from 'src/enums/user.enum';
import { Schema as MongooseSchema } from 'mongoose';
import { Settings } from './user-settings.entity';
import { Types } from 'mongoose';
import { jwtConstants } from 'src/constants/jwt.constant';
import { Collection } from 'src/modules/collections/entities/collection.entity';
import { Hashtag } from 'src/modules/feeds/entities/hashtag.entity';
import { Wallet } from 'src/modules/users/entities/wallet.entity';
import { FollowingTimestamps } from './user-following-timestamps.entity';
import { FollowersTimestamps } from './user-followers-timestamps.entity';
import { bannedUsernames } from '../dto/users.input';

export type UserDocument = User &
    Document & {
        checkPassword?(password: string): Promise<boolean>;
    };

@Schema({ timestamps: true })
@ObjectType()
export class User extends Document {
    @Field(() => ID)
    _id: string;

    @Field(() => String, { nullable: true })
    @Prop({ required: true, validate: { validator: validateName } })
    firstName?: string;

    @Field(() => String, { nullable: true })
    @Prop({
        /* required: true  */
        validate: { validator: validateName }
    })
    lastName: string;

    @Field(() => String, { nullable: true })
    @Prop({
        unique: true,
        required: true,
        validate: {
            validator: function (username) {
                return !bannedUsernames.includes(username?.toLowerCase());
            },
            message: 'This username is not allowed.'
        }
    })
    userName: string;

    @Field(() => String, { nullable: true })
    @Prop({
        // required: true,
        unique: true,
        validate: { validator: validateEmail }
    })
    email?: string;

    // @HideField()
    // @Field(() => String, { nullable: true })
    @Prop({
        type: String
    })
    password?: string;

    @Field(() => String, { nullable: true })
    @Prop({
        type: String,
        default: ''
    })
    phoneNumber: string;

    @Field(() => String, { nullable: true })
    @Prop()
    avatar: string;

    @Field(() => String, { nullable: true })
    @Prop()
    coverImage: string;

    @Field(() => Boolean, { defaultValue: false })
    @Prop({
        type: Boolean,
        default: false
    })
    isEmailVerified: boolean;

    @Field(() => Boolean)
    @Prop({
        type: Boolean,
        default: true
    })
    isActive: boolean;

    @Field(() => Boolean)
    @Prop({
        type: Boolean,
        default: false
    })
    hideWallet: boolean;

    @Field(() => [String])
    @Prop({
        type: [String]
    })
    roles: string[];

    @Field(() => String, { nullable: true })
    @Prop({ type: String })
    land_id?: string;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: false
    })
    isVerified?: boolean; /* successfull KYC */

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: false
    })
    isSCC?: boolean; /* Selected Content Creator (user can apply from user dropdown menu "apply for SCC Badge" and we apply from */

    @Field(() => String, { nullable: true })
    @Prop({ type: String, default: '' })
    scc_status?: string;

    @Field(() => String, { nullable: true })
    @Prop({ type: String, default: '' })
    verifyStatus?: string;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: false
    })
    isBlocked?: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: false
    })
    isBanned?: boolean;

    @Field(() => String, { nullable: true })
    @Prop({ type: String, default: '' })
    facebook: string;

    @Field(() => String, { nullable: true })
    @Prop({ type: String, default: '' })
    instagram: string;

    @Field(() => String, { nullable: true })
    @Prop({ type: String, default: '' })
    reddit: string;

    @Field(() => String, { nullable: true })
    @Prop({ type: String, default: '' })
    twitter: string;

    @Field(() => String, { nullable: true })
    @Prop({ type: String, default: '' })
    discord: string;

    @Field(() => String, { nullable: true })
    @Prop({ type: String, default: '' })
    youtube: string;

    @Field(() => String, { nullable: true })
    @Prop({ type: String, default: '' })
    tiktok: string;

    @Field(() => String, { nullable: true })
    @Prop({ type: String, default: '' })
    web: string;

    @Field(() => String, { nullable: true })
    @Prop()
    bio: string;

    @Field(() => String, { nullable: true })
    @Prop()
    wallet: string;

    @Field(() => [User], { nullable: true })
    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    followers?: Types.ObjectId[];

    @Field(() => Number, { nullable: true })
    @Prop({
        type: Number,
        default: 0
    })
    followersCount: number;

    @Field(() => [User], { nullable: true })
    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    following?: Types.ObjectId[];

    @Field(() => [Collection], { nullable: true })
    @Prop({
        type: [{ type: Types.ObjectId, ref: COLLECTIONS }],
        default: []
    })
    followingCollections?: Types.ObjectId[];

    @Field(() => [Hashtag], { nullable: true })
    @Prop({
        type: [{ type: Types.ObjectId, ref: Hashtag.name }],
        default: []
    })
    followingHashtags?: Types.ObjectId[];

    @Field(() => Number, { nullable: true })
    @Prop({
        type: Number,
        default: 0
    })
    followingCount: number;

    @Field(() => [FollowingTimestamps], { nullable: true })
    @Prop([FollowingTimestamps])
    followingTimestamps?: FollowingTimestamps[];

    @Field(() => [FollowersTimestamps], { nullable: true })
    @Prop(FollowersTimestamps)
    followersTimestamps: FollowersTimestamps[];

    @Field(() => [User], { nullable: true })
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    blockedBy?: Types.ObjectId[];

    @Field(() => [Wallet], { nullable: true })
    @Prop({ type: mongoose.Types.ObjectId, ref: 'Wallet' })
    wallets: Types.ObjectId[];

    @Prop({
        type: String,
        enum: [ESource.Mintstargram],
        default: ESource.Mintstargram
    })
    source: string;

    @Field(() => Number, { nullable: true })
    @Prop({ type: Number, default: 0 })
    points?: number;

    @HideField()
    @Field(() => Date, { nullable: true })
    @Prop()
    deletedAt?: Date;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: false
    })
    isDeleted?: boolean;

    @Prop()
    country: string;

    @Prop({ type: String, default: '' })
    key: string;

    @Field(() => User)
    @Prop({
        type: Types.ObjectId,
        ref: 'User'
    })
    referral: Types.ObjectId;

    @Field(() => Settings, { nullable: true })
    @Prop(Settings)
    settings: Settings;

    @Field(() => [User], { nullable: true })
    @Prop([{ type: Types.ObjectId, ref: 'User' }])
    blockedUsers: Types.ObjectId[];

    @Field(() => String, { nullable: true })
    @Prop({ type: String })
    twitterId: string;

    @Prop({ type: String })
    twitterAccessToken: string;

    @Prop({ type: String })
    twitterAccessSecret: string;

    @Prop({ type: String })
    facebookId: string;

    @Prop({ type: String })
    facebookAccessToken: string;

    @Prop({ type: String })
    facebookAccessSecret: string;

    @Prop({ type: String })
    linkedAccessToken: string;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: false })
    isLinkedInConnected: boolean;

    @Field(() => String, { nullable: true })
    @Prop({ type: String, default: 'dark' })
    backgroundTheme: string;

    @Field(() => Date, { nullable: true })
    @Prop()
    userNameUpdateAt?: Date;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: false
    })
    affiliatedUser?: boolean;

    @Field(() => Date, { nullable: true })
    @Prop({ type: Date, default: new Date() })
    lastLogin?: Date;

    @Field(() => Number, { nullable: true })
    @Prop({
        type: Number,
        default: 0
    })
    mintedNFTs: number;

    @Field(() => Number, { nullable: true })
    @Prop({
        type: Number,
        default: 0
    })
    boughtNFTs: number;

    @Field(() => Number, { nullable: true })
    @Prop({
        type: Number,
        default: 0
    })
    soldNFTs: number;

    @Field(() => Number, { nullable: true })
    @Prop({
        type: Number,
        default: 0
    })
    listedNFTs: number;

    @Field(() => Date, { nullable: true })
    @Prop()
    createdAt?: Date;

    // ---------------- for ruffy world ----------------

    @Field(() => Boolean, { defaultValue: false })
    @Prop({ type: Boolean, default: false })
    isTeacher?: boolean;

    @Field(() => Boolean, { defaultValue: false })
    @Prop({ type: Boolean, default: false })
    isComedian?: boolean;

    @Field(() => Boolean, { defaultValue: false })
    @Prop({ type: Boolean, default: false })
    isRuffyWorldUser?: boolean;

    // @Field(() => Boolean, { nullable: true })
    // @Prop({ type: Boolean, default:false})
    // isTeaccher?: boolean;

    // @Field(() => Boolean, { nullable: true })
    // @Prop({ type: Boolean, default:false})
    // isTeaccher?: boolean;

    @Field(() => Number, { nullable: true })
    @Prop({
        type: Number,
        default: 0
    })
    recentFollowersCount: number;

    @Field(() => String, { nullable: true })
    @Prop({
        type: String,
        default: ''
    })
    invitation_code: string;

    @Field(() => Number, { nullable: true })
    @Prop({
        type: Number,
        default: 0
    })
    login_attempts: number;

    @Field(() => Date, { nullable: true })
    @Prop({
        type: Date
    })
    lockedAt: Date;

    @Field(() => [String])
    @Prop({
        type: [String],
        default: []
    })
    onesignal_keys: string[];

    // @Field(() => String, { nullable: true })
    @Prop({ type: String, default: false })
    base32_secret?: string;

    @Field(() => Number, { nullable: true })
    @Prop({ type: Number, default: 0 })
    minted?: number;
}

export const UsersSchema = SchemaFactory.createForClass(User);

UsersSchema.index({ onesignal_keys: 1 });

function validateEmail(email: string) {
    const expression =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return expression.test(email);
}

function validateName(name: string) {
    const expression = /^(?![^\s]*https?|www\.)(?=[^\d\s]{1,10}$)[A-Za-z\s]*$/;
    return expression.test(name);
}

UsersSchema.statics.validateEmail = function (email: string): boolean {
    return validateEmail(email);
};

UsersSchema.methods.toJSON = function () {
    const obj = this.toObject();
    return obj;
};

UsersSchema.post('save', function (error, doc, next) {
    console.log(error, 'error=-=--=');
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next(new Error(`${Object.keys(error.keyValue)[0]} must be unique`));
    } else {
        next(error);
    }
});

UsersSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    // const user: any = this;
    // if (!user.password) {
    //   next();
    //   return;
    // }
    const hash = await bcrypt.hash(this.password, jwtConstants.salt);
    this.password = hash;
    next();
});

// UsersSchema.methods.isValidPassword = async function (password) {
//   // eslint-disable-next-line @typescript-eslint/no-this-alias
//   const user: any = this;
//   if (!user.password) {
//     return false;
//   }
//   const compare = await bcrypt.compare(password, user.password);
//   return compare;
// };

UsersSchema.methods.checkPassword = function (
    password: string
): Promise<boolean> {
    const user = this as UserDocument;

    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (error, isMatch) => {
            if (error) {
                reject(error);
            }

            resolve(isMatch);
        });
    });
};
