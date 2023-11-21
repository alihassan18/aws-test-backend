// twitter.strategy.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Model } from 'mongoose';
import { Strategy, Profile } from 'passport-twitter';
import { USERS } from 'src/constants/db.collections';
import { jwtConstants } from 'src/constants/jwt.constant';
import {
    Referral,
    ReferralDocument
} from 'src/modules/referral/entities/referral.entity';
import { UserDocument } from 'src/modules/users/entities/user.entity';

interface Info {
    message: string;
}

@Injectable()
export class TwitterStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(USERS) readonly userModel: Model<UserDocument>,
        @InjectModel(Referral.name)
        readonly referralModel: Model<ReferralDocument>,
        private readonly jwtService: JwtService
    ) {
        super({
            consumerKey: process.env.TWITTER_CONSUMER_KEY,
            consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
            callbackURL: `${process.env.BASE_URL}/auth/twitter/callback`,
            includeEmail: true,
            passReqToCallback: true
        });
    }

    async validate(
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: Error | null, user?: UserDocument, info?: Info) => void
    ): Promise<void> {
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const tokenn = req.session.token;
            const { id: twitterId, displayName, username, _json } = profile;

            if (tokenn) {
                const decoded = await this.jwtService.verifyAsync(tokenn, {
                    secret: jwtConstants.secret
                });

                if (!decoded) {
                    throw new Error('Token is not valid.');
                }
                let user = await this.userModel.findById(decoded?._id).exec();
                if (!user) {
                    throw new NotFoundException('User not exists.');
                }
                user.twitterAccessToken = accessToken;
                user.twitterAccessSecret = refreshToken;
                user.twitterId = twitterId;
                user.settings.isTwitterEnabled = true;
                user = await user.save();
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                return done(null, { user: user, token: null });
            } else {
                // Save the user's Twitter credentials to the database
                // Use the accessToken and refreshToken to make authenticated Twitter API requests on behalf of the user
                // Add any additional user handling logic here

                // Check if user already exists in the database
                let user = await this.userModel
                    .findOne({
                        // $or: [{ twitterId }, { email: _json?.email }]
                        email: _json?.email
                    })
                    .exec();

                if (!user) {
                    const name = _json?.name?.split(' ');

                    const isUsernameAvailable = await this.userModel.findOne({
                        userName: username?.toLowerCase()
                    });
                    // Create new user in the database if user doesn't exist
                    user = await this.userModel.create({
                        twitterId,
                        twitterAccessToken: accessToken,
                        twitterAccessSecret: refreshToken,
                        displayName,
                        userName: isUsernameAvailable
                            ? username?.toLowerCase() +
                              `${Math.floor(1000 + Math.random() * 9000)}`
                            : username?.toLowerCase(),
                        email: _json.email,
                        firstName: name[0],
                        lastName: name[1],
                        avatar: _json.profile_image_url
                    });
                    user.settings.isTwitterEnabled = true;
                    await user.save();
                    await this.referralModel.create({
                        user: user?._id,
                        requested: true
                    });
                } else {
                    // Update user's access token and access secret if user already exists
                    user.twitterAccessToken = accessToken;
                    user.twitterAccessSecret = refreshToken;
                    user.twitterId = twitterId;
                    user.settings.isTwitterEnabled = true;
                    user = await user.save();
                }

                // Generate JWT access token for user
                const payload = {
                    email: user.email,
                    _id: user._id,
                    twoFa: user?.settings?.twoFa,
                    key: user.key
                };

                const token = await this.jwtService.signAsync(payload, {
                    secret: jwtConstants.secret,
                    expiresIn: jwtConstants.expire
                });
                // const payload = {
                //     _id: user._id,
                //     twitterId,
                //     username,
                //     email: _json.email
                // };

                // const userData = {
                //     _id: user._id,
                //     firstName: user.firstName,
                //     lastName: user.lastName,
                //     userName: user.userName,
                //     email: user.email,
                //     hideWallet: user.hideWallet,
                //     phoneNumber: user.phoneNumber,
                //     wallet: user.wallet,
                //     roles: user.roles,
                //     isActive: user.isActive,
                //     avatar: user.avatar,
                //     coverImage: user.coverImage,
                //     isEmailVerified: user.isEmailVerified,
                //     facebook: user.facebook,
                //     instagram: user.instagram,
                //     reddit: user.reddit,
                //     twitter: user.twitter,
                //     discord: user.discord,
                //     youtube: user.youtube,
                //     tiktok: user.tiktok,
                //     web: user.web,
                //     bio: user.bio,
                //     followersCount: user.followersCount,
                //     followers: user.followers,
                //     following: user.following,
                //     followingCount: user.followingCount,
                //     isVerified: user.isVerified,
                //     isBlocked: user.isBlocked,
                //     settings: user.settings,
                //     key: user.key,
                //     referral: user.referral,
                //     wallets: user.wallets,
                //     source: user.source,
                //     country: user.country,
                //     followingHashtags: user.followingHashtags
                // };

                const userData = {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userName: user.userName,
                    email: user.email,
                    hideWallet: user.hideWallet,
                    phoneNumber: user.phoneNumber,
                    wallet: user.wallet,
                    roles: user.roles,
                    isActive: user.isActive,
                    avatar: user.avatar,
                    coverImage: user.coverImage,
                    isEmailVerified: user.isEmailVerified,
                    facebook: user.facebook,
                    instagram: user.instagram,
                    reddit: user.reddit,
                    twitter: user.twitter,
                    discord: user.discord,
                    youtube: user.youtube,
                    tiktok: user.tiktok,
                    web: user.web,
                    bio: user.bio,
                    followersCount: user.followersCount,
                    followers: user.followers,
                    following: user.following,
                    followingCount: user.followingCount,
                    isVerified: user.isVerified,
                    isBlocked: user.isBlocked,
                    isBanned: user.isBanned,
                    settings: user.settings,
                    isSCC: user.isSCC,
                    verifyStatus: user.verifyStatus,
                    key: user.key,
                    referral: user.referral,
                    wallets: user.wallets,
                    source: user.source,
                    country: user.country,
                    followingHashtags: user.followingHashtags,
                    twitterId: user.twitterId,
                    isLinkedInConnected: user.linkedAccessToken
                        ? true
                        : false /* user.isLinkedInConnected */,
                    followingCollections: user.followingCollections,
                    backgroundTheme: user.backgroundTheme,
                    blockedUsers: user.blockedUsers,
                    affiliatedUser: user.affiliatedUser,
                    points: user.points,
                    scc_status: user.scc_status,
                    invitation_code: user.invitation_code,
                    onesignal_keys: user.onesignal_keys,
                    userNameUpdateAt: user.userNameUpdateAt
                };

                done(null, {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    user: userData,
                    token,
                    isUserLogin: Boolean(tokenn)
                });
            }
        } catch (error) {
            console.log(error, 'error-=');
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            done(error);
        }
    }
}
