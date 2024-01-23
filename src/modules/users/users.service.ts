import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { VerificationService } from '../verification/verification.service';
import { verificationTypes } from 'src/constants/auth';
import { EmailService } from '../shared/services/email.service';
import { FilterQuery, Model, Types } from 'mongoose';
import { generateRandomNumber } from 'src/helpers/common.helpers';
import {
    ProfileInput,
    SettingsInput,
    bannedUsernames
} from './dto/users.input';
import { USERS } from 'src/constants/db.collections';
import { translate } from 'src/common/translations';

@Injectable()
export class UsersService {
    constructor(
        // eslint-disable-next-line no-unused-vars
        @InjectModel(USERS)
        readonly userModel: Model<UserDocument>,
        private readonly verificationService: VerificationService,
        private readonly emailService: EmailService
    ) {}

    public hideFields =
        '-email -roles -phoneNumber -lastLogin -invitation_code -login_attempts -lockedAt -onesignal_keys';

    create(data) {
        return this.userModel.create(data);
    }

    async findAll(
        query?: FilterQuery<UserDocument>,
        isSecure?: boolean
    ): Promise<UserDocument[]> {
        if (isSecure) {
            return this.userModel.find(query).select(this.hideFields).exec();
        } else {
            return (
                this.userModel
                    .find(query)
                    // .select(this.hideFields)
                    .exec()
            );
        }
    }

    async findUserById(id: string | Types.ObjectId): Promise<UserDocument> {
        return (
            this.userModel
                .findById(id)
                // .select(this.hideFields)
                .exec()
        );
    }

    async findOne(
        clause: {
            [key: string]: unknown;
        },
        isSecure?: boolean
    ): Promise<UserDocument | undefined> {
        let user;
        if (isSecure) {
            user = await this.userModel
                .findOne(clause)
                .select(this.hideFields)
                .exec();
        } else {
            user = await this.userModel.findOne(clause).exec();
        }
        if (user) return user;
        return undefined;
    }

    async findById(
        id: Types.ObjectId,
        isSecure?: boolean
    ): Promise<UserDocument> {
        if (isSecure) {
            return this.userModel.findById(id).select(this.hideFields).exec();
        } else {
            return (
                this.userModel
                    .findById(id)
                    // .select(this.hideFields)
                    .exec()
            );
        }
    }

    async findByAddress(address: string): Promise<UserDocument> {
        return this.userModel.findOne({ wallet: address }).exec();
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }

    // ---------------------------------------------------------

    async findOneByEmail(email: string): Promise<UserDocument | undefined> {
        const user = await this.userModel
            .findOne({ email: email.toLowerCase() })
            // .select(this.hideFields)
            .exec();
        if (user) return user;
        return undefined;
    }

    async findOneAndUpdate(
        clause: {
            [key: string]: unknown;
        },
        data
    ): Promise<UserDocument | undefined> {
        const results = await this.userModel
            .findOneAndUpdate(clause, data, {
                new: true
            })
            .exec();
        return results;
    }

    async send2FaVerificationCode(
        userId: Types.ObjectId,
        email: string,
        firstName: string
    ) {
        const code = generateRandomNumber();
        this.verificationService.createCode(
            code,
            userId,
            verificationTypes.TWO_FA
        );

        return this.emailService.sendVerificationCode(email, code, firstName);
    }

    async changeSettings(userId: Types.ObjectId, data: SettingsInput) {
        return this.userModel.findOneAndUpdate(
            { _id: userId },
            {
                settings: data,
                // base32_secret: data?.base32_secret == "null" ? "" : data?.base32_secret
                ...(data?.base32_secret && {
                    base32_secret:
                        data?.base32_secret == 'null' ? '' : data?.base32_secret
                })
            },
            {
                new: true
            }
        );
    }

    async searchUsers(
        query: string,
        loggedUserId?: Types.ObjectId
    ): Promise<User[]> {
        const filter = { userName: { $regex: `${query}`, $options: 'i' } };
        if (loggedUserId) {
            const user = await this.userModel.findById(loggedUserId).exec();

            filter['_id'] = { $nin: [...user.blockedUsers, user._id] };
            if (!query) {
                filter['_id'] = { $in: user.followers };
            }
        }

        const searchedUsers = await this.userModel.find(filter).limit(5).exec();

        return searchedUsers;
    }

    async editProfile(id: Types.ObjectId, data: ProfileInput) {
        const _user = await this.userModel.findById(id);

        if (data.firstName || data.lastName) {
            const nameExp =
                /^(?![^\s]*https?|www\.)(?=[^\d\s]{1,10}$)[A-Za-z\s]*$/;

            if (!nameExp.test(data.firstName) || !nameExp.test(data.lastName)) {
                throw new Error('Name must be valid');
            }
        }
        if (data?.bio?.length > 301) {
            throw new Error('Bio must be at least 300 characters');
        }
        if (
            data?.facebook?.length >= 300 ||
            data?.instagram?.length >= 300 ||
            data?.reddit?.length >= 300 ||
            data?.twitter?.length >= 300 ||
            data?.discord?.length >= 300 ||
            data?.youtube?.length >= 300 ||
            data?.tiktok?.length >= 300 ||
            data?.web?.length >= 300
        ) {
            throw new Error('Social Media link at least 30 characters');
        }

        if (data?.onesignal_keys) {
            await this.userModel.updateMany(
                {},
                { $pullAll: { onesignal_keys: data.onesignal_keys } }
            );
        }

        if (
            data?.userName &&
            bannedUsernames.includes(data?.userName?.toLowerCase())
        ) {
            throw new Error(translate('user.username_not_allowed'));
        }

        if (
            _user.userNameUpdateAt &&
            data.userName &&
            _user.userName !== data.userName
        ) {
            const isUserNameExist = await this.userModel.findOne({
                userName: data.userName
            });
            if (isUserNameExist) {
                throw new Error(translate('user.username_use'));
            }
            const currentDate = new Date();
            const userNameUpdatedAt = new Date(_user.userNameUpdateAt);
            const timeDifference =
                currentDate.getTime() - userNameUpdatedAt.getTime();
            const daysDifference = timeDifference / (1000 * 3600 * 24);

            if (daysDifference >= 7) {
                return this.userModel.findByIdAndUpdate(
                    id,
                    { $set: { ...data, userNameUpdateAt: new Date() } },
                    { new: true }
                );
            } else {
                throw new Error(translate('user.username_7daychange'));
            }
        } else {
            if (data?.onesignal_keys) {
                return this.userModel.findByIdAndUpdate(
                    id,
                    {
                        $addToSet: {
                            onesignal_keys: { $each: data.onesignal_keys }
                        }
                    },
                    { new: true }
                );
            } else {
                return this.userModel.findByIdAndUpdate(
                    id,
                    {
                        $set: {
                            ...data
                        }
                    },
                    { new: true }
                );
            }
        }
    }

    async blockUser(
        userId: Types.ObjectId,
        targetUserId: Types.ObjectId
    ): Promise<User> {
        let isfollower = false;
        let isfollowing = false;
        const user: User = await this.userModel.findById(userId).exec();
        const targetUser: User = await this.userModel
            .findById(targetUserId)
            .exec();

        if (
            user.followers.find((follower) =>
                new Types.ObjectId(targetUserId).equals(follower._id)
            )
        ) {
            isfollower = true;
        }
        if (
            user.following.find((following) =>
                new Types.ObjectId(targetUserId).equals(following._id)
            )
        ) {
            isfollowing = true;
        }

        if (isfollower || isfollowing) {
            await this.userModel.findByIdAndUpdate(targetUser, {
                ...(isfollowing && {
                    $pull: { followers: userId },
                    $inc: { followersCount: -1 }
                }),
                ...(isfollower && {
                    $pull: { following: userId }
                })
            });
        }
        return await this.userModel
            .findByIdAndUpdate(
                userId,
                {
                    $addToSet: { blockedUsers: targetUserId },
                    ...(isfollower && {
                        $pull: { followers: targetUserId },
                        $inc: { followersCount: -1 }
                    }),
                    ...(isfollowing && {
                        $pull: { following: targetUserId }
                    })
                },
                { new: true }
            )
            .exec();
    }

    async unblockUser(
        userId: Types.ObjectId,
        targetUserId: Types.ObjectId
    ): Promise<User> {
        return await this.userModel
            .findByIdAndUpdate(
                userId,
                { $pull: { blockedUsers: targetUserId } },
                { new: true }
            )
            .exec();
    }

    async getUserByTwitterId(twitterId: string): Promise<User> {
        return this.userModel.findOne({ twitterId });
    }

    async getUserByFacebookId(facebookId: string): Promise<User> {
        return this.userModel.findOne({ facebookId });
    }

    async connectTwitter(
        userId: string,
        accessToken: string,
        accessSecret: string
    ): Promise<User> {
        const user = await this.userModel.findById(userId);
        const existingUser = await this.userModel.findOne({
            twitterId: user.twitterId
        });

        if (existingUser && existingUser._id.toString() !== userId) {
            // Twitter account already linked to another user
            // throw new ConflictException(
            //     'Twitter account is already linked to another user'
            // );
        }

        user.twitterAccessToken = accessToken;
        user.twitterAccessSecret = accessSecret;
        return await user.save();
    }

    // ------ GLOBAL SEARCH ----------------

    async globalSearch(query: string): Promise<{
        users: UserDocument[];
    }> {
        const bannedUsers = await this.allBannedUsers();

        const previousDay = new Date();
        previousDay.setDate(previousDay.getDate() - (query == '' ? 1 : 10000));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aggregation: any = [
            {
                $match: {
                    $or: [
                        {
                            firstName: {
                                $regex: `${query}`,
                                $options: 'i'
                            }
                        },
                        {
                            lastName: {
                                $regex: `${query}`,
                                $options: 'i'
                            }
                        },
                        {
                            userName: {
                                $regex: `${query}`,
                                $options: 'i'
                            }
                        }
                    ],
                    _id: { $nin: bannedUsers }
                }
            }
        ];

        if (!query) {
            aggregation.push(
                {
                    $addFields: {
                        hasRecentFollower: {
                            $cond: {
                                if: { $isArray: '$followersTimestamps' },
                                then: {
                                    $anyElementTrue: {
                                        $map: {
                                            input: '$followersTimestamps',
                                            in: {
                                                $gte: [
                                                    '$$this.createdAt',
                                                    previousDay
                                                ]
                                            }
                                        }
                                    }
                                },
                                else: false
                            }
                        }
                    }
                },
                {
                    $match: {
                        hasRecentFollower: true
                    }
                },
                {
                    $addFields: {
                        recentFollowers: {
                            $filter: {
                                input: '$followersTimestamps',
                                as: 'timestamp',
                                cond: {
                                    $gte: ['$$timestamp.createdAt', previousDay]
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        recentFollowersCount: { $size: '$recentFollowers' }
                    }
                }
            );
        }

        aggregation.push({
            $limit: query == '' ? 3 : 6
        });

        const [users] = await Promise.all([
            this.userModel.aggregate(aggregation)
        ]);

        return {
            users: users
        };
    }

    async ownFollowersUsers(loggedUserId: Types.ObjectId): Promise<User[]> {
        const u = await this.userModel.findById(loggedUserId);
        const x = await this.userModel.find({ _id: u.followers });
        return x;
    }

    async ownBlockedUsers(loggedUserId: Types.ObjectId): Promise<User[]> {
        const u = await this.userModel.findById(loggedUserId);
        return this.userModel.find({ _id: u.blockedUsers });
    }

    async allBannedUsers() {
        const bannedUsers = await this.userModel
            .find({ isBanned: true })
            .select('_id');
        return bannedUsers.map((user) => user._id);
    }

    async findUsersByCreatorIds(creatorIds: Types.ObjectId[]): Promise<User[]> {
        // Implement your logic to find users by creatorIds in the database
        // For example:
        const users = await this.userModel
            .find({ _id: { $in: creatorIds } })
            .exec();

        return users;
    }

    // ------------------------- KYC VERIFICATION ----------------------------

    async kycVerify(email: string, status) {
        const checkResult = await this.userModel
            .findOne({ email: email })
            .select('userName isVerified verifyStatus email');
        if (checkResult?.isVerified) {
            return checkResult;
        } else {
            if (status == 7001) {
                const results = await this.userModel
                    .findOneAndUpdate(
                        { email: email },
                        {
                            $set: { verifyStatus: 'Started' }
                        },
                        {
                            new: true
                        }
                    )
                    .select('userName isVerified verifyStatus email');
                return results;
            }
            if (status == 7002) {
                const results = await this.userModel
                    .findOneAndUpdate(
                        { email: email },
                        {
                            $set: { verifyStatus: 'Submitted' }
                        },
                        {
                            new: true
                        }
                    )
                    .select('userName isVerified verifyStatus email');
                return results;
            } else {
                return null;
            }
        }
    }

    async kycVerifyCompleted(email: string, status) {
        const checkResult = await this.userModel
            .findOne({ email: email })
            .select('userName isVerified verifyStatus email');
        if (checkResult?.isVerified) {
            return checkResult;
        } else {
            if (status == 9001) {
                // let data;

                // if (document.country) {
                //     data = countries.filter((c) => {
                //         if (c.code == document.country) return c;
                //     });
                // }
                // if (data[0]) {
                //     await this.userModel.findOneAndUpdate(
                //         { email: email },
                //         {
                //             country: data[0]
                //         }
                //     );
                // }
                const results = await this.userModel
                    .findOneAndUpdate(
                        { email: email },
                        {
                            $set: { verifyStatus: 'Passed', isVerified: true }
                        },
                        {
                            new: true
                        }
                    )
                    .select('userName isVerified verifyStatus email');

                return results;
            } else {
                const results = await this.userModel
                    .findOneAndUpdate(
                        { email: email },
                        {
                            $set: { verifyStatus: 'Failed' }
                        },
                        {
                            new: true
                        }
                    )
                    .select('userName isVerified verifyStatus email');
                return results;
            }
        }
    }

    async isUserSettingEnabled(
        id: string | Types.ObjectId,
        settingType: string
    ) {
        const user = await this.userModel.findById(id).exec();
        const settingKeys = settingType.split('.');
        const isSettingEnabled = settingKeys.reduce(
            (obj, key) => obj?.[key],
            user?.settings
        );
        return !!isSettingEnabled;
    }

    async getUserPublicProfile(userName: string): Promise<UserDocument> {
        return this.userModel.findOne({ userName });
    }
}
