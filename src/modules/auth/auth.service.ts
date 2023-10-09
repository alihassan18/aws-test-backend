import { Injectable } from '@nestjs/common';
import {
    LoginGoogleInput,
    LoginGoogleOutput,
    LoginResult,
    LoginUserInput,
    RWLoginResult,
    SignOutResult,
    VerifyEmailOutput
} from 'src/modules/users/dto/users.input';
import { UserDocument, User } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';
import { InjectModel } from '@nestjs/mongoose';
import {
    Verification,
    VerificationDocument
} from '../verification/entities/verification.entity';
import { Model, Types } from 'mongoose';
import { emailRegex, verificationTypes } from 'src/constants/auth';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { OAuth2Client } from 'google-auth-library';
import { ReferralService } from 'src/modules/referral/referral.service';
import { CommonServices } from '../shared/services/common.service';
import { generateRandomNumber } from 'src/helpers/common.helpers';
import * as bcrypt from 'bcryptjs';
import { TwitterStrategy } from './strategies/twitter.strategy';
import { ERole } from 'src/constants/roles';
import { IpAddressService } from '../ip-address/ip-address.service';
import {
    Referral,
    ReferralDocument
} from '../referral/entities/referral.entity';
import {
    Notification,
    NotificationDocument
} from '../notifications/entities/notification.entity';
import {
    ENotificationFromType,
    NotificationType
} from '../notifications/notifications.enum';
import { ScoresService } from '../scores/scores.service';

@Injectable()
export class AuthService extends CommonServices {
    constructor(
        @InjectModel(Verification.name)
        private verificationModel: Model<VerificationDocument>,
        private userService: UsersService,
        private jwtService: JwtService,
        private verificationService: VerificationService,
        private emailService: EmailService,
        private referralService: ReferralService,
        private ipAddressService: IpAddressService,
        private readonly twitterStrategy: TwitterStrategy,
        private scoresService: ScoresService,
        @InjectModel(Referral.name)
        readonly referralModel: Model<ReferralDocument>,
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<NotificationDocument>
    ) {
        super();
    }

    async validateToken(token: string) {
        try {
            const decoded = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret
            });
            return decoded;
        } catch (error) {
            // If the token is invalid or expired, return null.
            return null;
        }
    }

    async validateUser(identifier: string): Promise<User> {
        const user = await this.userService.userModel.findOne({
            wallet: identifier
        });
        if (user) {
            return user;
        }
        return null;
    }

    // async login(user: UserDocument) {
    //     // const referral = await this.referralService.referralModel.findOne({
    //     //     user: user?._id
    //     // });
    //     // let ref = false;
    //     // if (referral) {
    //     //     ref = true;
    //     // }
    //     const payload = {
    //         email: user.email,
    //         _id: user._id
    //     };

    //     if (user?.settings?.twoFa) {
    //         await this.userService.send2FaVerificationCode(
    //             user?._id,
    //             user?.email,
    //             user?.firstName
    //         );
    //         return {
    //             access_token: this.jwtService.sign(
    //                 {
    //                     userId: user._id,
    //                     twoFa: user?.settings?.twoFa,
    //                     temp: true
    //                 },
    //                 {
    //                     // secret: env.JWT_SECRET_2FA,
    //                     expiresIn: 60 * 15
    //                 }
    //             ),
    //             user: null,
    //             twoFa: user?.settings?.twoFa
    //         };
    //     } else {
    //         return {
    //             access_token: this.jwtService.sign(payload, {
    //                 expiresIn: '30d'
    //             }),
    //             user: payload,
    //             twoFa: user?.settings?.twoFa
    //         };
    //     }
    // }

    async verifyEmail(
        _id: Types.ObjectId,
        IpAddress: string
    ): Promise<VerifyEmailOutput> {
        const user = await this.userService.userModel.findOne({
            _id
        });
        if (!user) {
            throw new Error('User does not exists.');
        }
        if (user?.isEmailVerified) {
            throw new Error('Email already verified, Please login');
        }
        user.isEmailVerified = true;
        await user.save();

        const result: LoginResult = await this.createJwt(user, IpAddress);

        return {
            message: `Email successfully verified`,
            success: true,
            loginResult: result
        };
    }

    async checkSignUpValidation(body: { email: string; userName: string }) {
        const errors = [];
        //email
        const [checkUser, checkUser2] = await Promise.all([
            this.userService.findOne({
                email: body.email
            }),
            this.userService.findOne({
                userName: body.userName
            })
        ]);
        if (
            checkUser &&
            checkUser.email &&
            checkUser2 &&
            checkUser2.userName == body.userName
        ) {
            errors.push({
                message: `${checkUser.email} and ${checkUser2.userName} already registered`
            });
        } else if (
            checkUser &&
            checkUser.email
            // &&
            // checkUser.role &&
            // checkUser.role == ERole.USER
        ) {
            errors.push({ message: `${checkUser.email} already registered` });
        } else if (checkUser2 && checkUser2.userName == body.userName)
            errors.push({
                message: `${checkUser2.userName} already registered`
            });
        else {
            const re = emailRegex;
            if (!re.test(String(body.email).toLowerCase())) {
                errors.push({ email: this.messages.invalidEmailFormat });
            }
        }

        return [body, errors];
    }

    async validateUserByPassword(
        loginAttempt: LoginUserInput,
        IpAddress: string
    ): Promise<LoginResult | undefined> {
        // password protection

        // This will be used for the initial login
        let userToAttempt: UserDocument | undefined;
        if (loginAttempt.email) {
            userToAttempt = await this.userService.userModel
                .findOne({
                    $or: [
                        { email: loginAttempt.email },
                        {
                            userName: {
                                $regex: `^${loginAttempt.email}$`,
                                $options: 'i'
                            }
                        }
                    ]
                })
                .exec();
        }
        // If the user is not enabled, disable log in - the token wouldn't work anyways
        if (userToAttempt && userToAttempt.isActive === false)
            userToAttempt = undefined;

        if (!userToAttempt) return undefined;

        if (userToAttempt.isBlocked) {
            throw new Error('You are blocked from administrative');
        }

        if (userToAttempt.isBanned) {
            throw new Error('You are banned from administrative');
        }

        if (userToAttempt.lockedAt) {
            const currentTime = new Date();
            const lockedAtTime = new Date(userToAttempt.lockedAt);
            if (currentTime < lockedAtTime) {
                throw new Error(
                    'Your account is currently locked for 1 hour. Please try again later.'
                );
            } else {
                userToAttempt =
                    await this.userService.userModel.findOneAndUpdate(
                        { _id: userToAttempt._id },
                        { login_attempts: 0, lockedAt: null },
                        { new: true }
                    );
            }
        }

        // if(!userToAttempt.isEmailVerified) throw new Error('You must varify your email address')
        // will do later when email verify api will work properly
        // Check the supplied password against the hash stored for this email address
        let isMatch = false;
        try {
            isMatch = await userToAttempt.checkPassword(loginAttempt.password);
        } catch (error) {
            return undefined;
        }

        if (isMatch) {
            if (userToAttempt.login_attempts !== 0) {
                await this.userService.userModel.findOneAndUpdate(
                    { _id: userToAttempt._id },
                    { login_attempts: 0, lockedAt: null }
                );
            }

            if (userToAttempt.settings.twoFa) {
                await this.userService.send2FaVerificationCode(
                    userToAttempt?._id,
                    userToAttempt?.email,
                    userToAttempt?.firstName
                );

                const jwt = await this.jwtService.signAsync(
                    {
                        _id: userToAttempt._id,
                        email: userToAttempt.email,
                        twoFa: userToAttempt?.settings?.twoFa,
                        key: userToAttempt?.key,
                        temp: true
                    },
                    {
                        secret: jwtConstants.secret,
                        expiresIn: 60 * 15
                    }
                );
                return {
                    access_token: jwt,
                    user: null,
                    twoFa: userToAttempt?.settings?.twoFa
                };
            } else {
                // If there is a successful match, generate a JWT for the user
                const result: LoginResult = await this.createJwt(
                    userToAttempt,
                    IpAddress
                );
                // userToAttempt.timestamp = new Date();
                // userToAttempt.save();
                // password protectio
                if (!result.user?.invitation_code) {
                    return {
                        notAffiliated: true,
                        user: null,
                        access_token: result.access_token
                    };
                }
                return { ...result, notAffiliated: false };
            }
        } else {
            if (userToAttempt) {
                if (userToAttempt.login_attempts < 4) {
                    await this.userService.userModel.findOneAndUpdate(
                        { _id: userToAttempt._id },
                        {
                            $set: {
                                login_attempts: Number(
                                    userToAttempt.login_attempts + 1
                                )
                            }
                        }
                    );
                } else {
                    await this.userService.userModel.findOneAndUpdate(
                        { _id: userToAttempt._id },
                        {
                            $set: {
                                lockedAt: new Date().setHours(
                                    new Date().getHours() + 1
                                )
                            }
                        }
                    );
                    throw new Error(
                        'Your account has been temporarily locked due to login attempts'
                    );
                }
            }
        }

        return undefined;
    }

    async createJwt(
        u: User,
        IpAddress?: string
    ): Promise<{ user: User; access_token: string }> {
        const user = {
            email: u.email,
            _id: u._id,
            twoFa: u?.settings?.twoFa,
            key: u.key
        };
        if (IpAddress) await this.ipAddressService.create(u._id, IpAddress);

        const jwt = await this.jwtService.signAsync(user, {
            secret: jwtConstants.secret,
            expiresIn: jwtConstants.expire
        });

        const payload = {
            _id: u._id,
            firstName: u.firstName,
            lastName: u.lastName,
            userName: u.userName,
            email: u.email,
            hideWallet: u.hideWallet,
            phoneNumber: u.phoneNumber,
            wallet: u.wallet,
            roles: u.roles,
            isActive: u.isActive,
            avatar: u.avatar,
            coverImage: u.coverImage,
            isEmailVerified: u.isEmailVerified,
            facebook: u.facebook,
            instagram: u.instagram,
            reddit: u.reddit,
            twitter: u.twitter,
            discord: u.discord,
            youtube: u.youtube,
            tiktok: u.tiktok,
            web: u.web,
            bio: u.bio,
            followersCount: u.followersCount,
            followers: u.followers,
            following: u.following,
            followingCount: u.followingCount,
            isVerified: u.isVerified,
            isBlocked: u.isBlocked,
            isBanned: u.isBanned,
            settings: u.settings,
            isSCC: u.isSCC,
            verifyStatus: u.verifyStatus,
            key: u.key,
            referral: u.referral,
            wallets: u.wallets,
            source: u.source,
            country: u.country,
            followingHashtags: u.followingHashtags,
            twitterId: u.twitterId,
            isLinkedInConnected: u.isLinkedInConnected,
            followingCollections: u.followingCollections,
            backgroundTheme: u.backgroundTheme,
            blockedUsers: u.blockedUsers,
            affiliatedUser: u.affiliatedUser,
            points: u.points,
            land_id: u.land_id,
            scc_status: u.scc_status,
            invitation_code: u.invitation_code
        };

        return {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            user: payload,
            access_token: jwt
        };
    }

    async createUser(body, IpAddress): Promise<SignOutResult | undefined> {
        try {
            const isAlreadyUser = await this.userService.findOne({
                $or: [
                    { email: body.email },
                    { userName: body.email.toLowerCase() }
                ]
            });

            if (isAlreadyUser) {
                return { message: 'User already registered, Please Login' };
            }

            // ------- REFRRAL -------

            let referral = null;
            if (body?.referral) {
                referral = await this.userService.findOne({
                    userName: body.referral
                });

                // referral = await this.userService.findOne({
                //     invitation_code: body.referral
                // });
            }

            const createUser = await this.userService.create({
                ...body,
                ...(referral && { referral: referral?._id })
            });

            const loggedIn = await this.createJwt(createUser, IpAddress);

            if (body?.isRuffyWorldUser) {
                this.emailService.sendRWVerifyEmail(
                    body.email,
                    createUser._id,
                    loggedIn.access_token,
                    createUser.firstName
                );
            } else {
                this.emailService.sendVerifyEmail(
                    body.email,
                    createUser._id,
                    loggedIn.access_token
                );
            }

            // password protection

            await this.referralModel.create({
                user: createUser?._id,
                requested: true
            });

            if (referral) {
                await this.referralService.add(referral?._id, createUser?._id);
                const url = `${process.env.FRONT_BASE_URL}/invite`;
                this.emailService.sendReferralEmail(
                    referral.email,
                    createUser?.firstName + ' ' + createUser?.lastName,
                    url
                );
            }

            return {
                // user: loggedIn,
                message: this.messages.verificationEmail,
                access_token: loggedIn.access_token
            };
        } catch (error) {
            return error;
        }
    }

    async sendPasswordResetEmail(email: string) {
        const user = await this.userService.findOne({ email });

        if (!user) {
            throw new Error('No user found with this email');
        }
        const { _id } = user;
        const verification = await this.verificationModel.findOne({
            userId: _id,
            type: verificationTypes.FORGOT_PASSWORD
        });

        if (verification) {
            const hours =
                Math.abs(
                    new Date().getTime() -
                        new Date(verification.updatedAt).getTime()
                ) / 36e5;
            if (verification.attempts > 2 && hours < 24) {
                throw new Error(
                    'You have already made 3 attempts please retry after 24 hours'
                );
            }

            if (hours < 1) {
                throw new Error(
                    'Email already sent, kindly retry after 1 hour.'
                );
            }
        }

        const code = generateRandomNumber();
        this.verificationService.createCode(
            code,
            _id,
            verificationTypes.FORGOT_PASSWORD
        );
        return await this.emailService.sendForgotPasswordEmail(
            email,
            code,
            user.firstName
        );
    }

    async verifyCode(body: { email: string; code: string }) {
        const { email, code } = body;

        const user = await this.userService.findOne({ email: email });

        if (!user) {
            throw new Error('No user found with this email');
        }

        const verification = await this.verificationService.findByUserId(
            user._id
        );
        if (verification.attempts > 2) {
            throw new Error(
                'You have already made 3 attempts please retry after 24 hours'
            );
        } else {
            if (verification.code === code) {
                await this.verificationModel.findOneAndUpdate(
                    { _id: verification._id },
                    { isVerified: true },
                    { new: true }
                );
                return { success: true };

                // const mailRes = await Mailer.sendForgotPasswordEmail(email, code);
            } else {
                verification.attempts = verification.attempts + 1;
                await verification.save();
                throw new Error('Incorrect pin entered');
            }
        }
    }

    async resetPassword(body: {
        email: string;
        code: string;
        password: string;
        confirmPassword: string;
    }) {
        const { email, code, password, confirmPassword } = body;
        if (password !== confirmPassword) {
            throw new Error(`Confirm Password didn't match`);
        }
        // if (
        //     !/(?=^.{8,}$)(?=.*\d)(?=.*[!$%^&()_+|~=`{}\[\]:";'<>?,.#@*-\/\\]*)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/.test(
        //         password
        //     )
        // ) {
        //     throw new Err    or(`Password too weak`);
        // }

        const user = await this.userService.findOne({ email: email });
        if (user) {
            const verification = await this.verificationService.findByUserId(
                user._id
            );

            const isVerified = await this.verificationModel.findOne({
                _id: verification._id,
                isVerified: true,
                code
            });
            if (isVerified) {
                const pwd = bcrypt.hashSync(password, jwtConstants.salt);
                const key = user._id + code + user._id;
                await this.userService.findOneAndUpdate(user._id, {
                    password: pwd,
                    key: key
                });

                await this.notificationModel.create({
                    type: NotificationType.SYSTEM,
                    sender: ENotificationFromType.APP,
                    message: `Your Password has been changed successfully`,
                    receiver: user._id
                });

                return { success: true };
            } else {
                throw new Error('Please verify your code first');
            }
        } else {
            throw new Error('No user found on that email');
        }
    }

    async resendVerificationEmail(body: { email: string }) {
        const { email } = body;
        const user = await this.userService.findOne({ email: email });

        if (!user) {
            throw new Error('No user found with this email');
        }
        const payload = {
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            wallet: user.wallet,
            active: user.isActive,
            avatar: user.avatar,
            coverImage: user.coverImage,
            isEmailVerified: user.isEmailVerified
        };

        const token = this.jwtService.sign(
            payload /* , { expiresIn: '60d' } */
        );

        const data = await this.emailService.sendVerifyEmail(
            email,
            user._id,
            token
        );
        return data;
    }

    async googleLogin(
        data: LoginGoogleInput,
        IpAddress
    ): Promise<LoginGoogleOutput> {
        const { token, referral: referralId } = data;

        let referral = null;
        if (referralId) {
            referral = await this.userService.findOne({ _id: referralId });
        }

        // --------- GOOGLE LOGIN ---------

        const client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.FRONT_BASE_URL
        );

        const tokenRes = await client.getToken(token);
        const ticket = await client.verifyIdToken({
            idToken: tokenRes.tokens.id_token,
            audience: process.env.CLIENT_ID
        });
        const { name, email, picture } = ticket.getPayload();
        const firstName = name.split(' ')[0];
        const lastName = name.split(' ')[1];
        const userName =
            firstName.toLowerCase() +
            '' +
            lastName.toLocaleLowerCase() +
            `${Math.floor(1000 + Math.random() * 9000)}`;

        let user = await this.userService.findOneAndUpdate(
            { email },
            {
                firstName,
                lastName,
                email,
                avatar: picture,
                isEmailVerified: true
            }
        );
        if (!user) {
            user = await this.userService.create({
                firstName,
                lastName,
                email: email,
                avatar: picture,
                userName: userName,
                isEmailVerified: true,
                ...(referral && { referral })
            });
        }

        const loggedUser = await this.createJwt(user, IpAddress);

        if (loggedUser?.user?.isBlocked === true) {
            // return {
            //     message: this.messages.userBlocked,
            //     success: false,
            //     status: HttpStatus.FORBIDDEN
            // };
            return undefined;

            // ---------------------------
        }
        // password protection

        if (!loggedUser.user?.invitation_code) {
            return {
                notAffiliated: true,
                user: null,
                access_token: loggedUser.access_token
            };
        }

        return { ...loggedUser, notAffiliated: false };
    }

    // ------------------- 2FA VERIFICATION ------------------------

    async send2faCode(_id: Types.ObjectId, email: string) {
        const code = generateRandomNumber();
        const user = await this.userService.findOne({ email: email });
        const objectId = new Types.ObjectId(_id);

        this.verificationService.createCode(
            code,
            objectId,
            verificationTypes.TWO_FA
        );
        await this.emailService.sendVerificationCode(
            email,
            code,
            user.firstName
        );
        return { success: true, message: this.messages.verificationEmail };
    }

    async verify2faCode(body: {
        email: string;
        code: string;
        userId: Types.ObjectId;
    }) {
        try {
            const { email, code, userId } = body;

            const response = await this.verifyCode({ email, code });
            if (response.success) {
                const user = await this.userService.userModel.findById(userId);
                const updated =
                    await this.userService.userModel.findByIdAndUpdate(
                        user._id,
                        {
                            $set: {
                                settings: {
                                    ...user.settings,
                                    twoFa: user.settings?.twoFa ? false : true
                                }
                            }
                        },
                        { new: true }
                    );
                // user.settings.twoFa = !user.settings.twoFa;
                // await user.save();
                await this.notificationModel.create({
                    type: NotificationType.SYSTEM,
                    sender: ENotificationFromType.APP,
                    message: updated.settings.twoFa
                        ? this.messages.faSuccessfully
                        : this.messages.faSuccessfullyRemove,
                    receiver: user._id
                });

                const result: LoginResult = await this.createJwt(updated);

                return {
                    success: true,
                    token: result.access_token,
                    message: updated.settings.twoFa
                        ? this.messages.faSuccessfully
                        : this.messages.faSuccessfullyRemove,
                    status: updated.settings.twoFa
                };
            }
        } catch (error) {
            return;
        }
    }

    // ------------------- 2FA LOGIN ------------------------

    async verify2faLogin(
        body: {
            email: string;
            code: string;
            userId: Types.ObjectId;
        },
        IpAddress
    ) {
        const { email, code, userId } = body;

        const response = await this.verifyCode({ email, code });
        if (response.success) {
            const user = await this.userService.userModel.findById(userId);
            const result: LoginResult = await this.createJwt(user, IpAddress);
            return result;
        }
    }

    // --------------- DELETE ACCOUNT ---------------

    async deleteUserAccount(id: Types.ObjectId) {
        const user = await this.userService.userModel.findById(id);
        const random = Math.random().toString(36).substring(2, 17);
        await this.userService.userModel.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
            isBlocked: true,
            isActive: false,
            email: user.email + '_' + random,
            userName: user.userName + '_' + random
        });
        return { success: true };
    }

    async changePassword(
        userId: Types.ObjectId,
        currentPassword: string,
        newPassword: string
    ): Promise<boolean> {
        const user = await this.userService.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const passwordsMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!passwordsMatch) {
            throw new Error('Current password is incorrect');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.userService.userModel
            .updateOne(
                { _id: userId },
                { $set: { password: hashedNewPassword } }
            )
            .exec();

        return true;
    }

    async isUsernameAvailable(userName: string) {
        const isAvailable = await this.userService.findOne({
            userName: { $regex: `^${userName}$`, $options: 'i' }
        });
        if (isAvailable) {
            return { success: true, message: 'Already available' };
        } else {
            return { success: false, message: 'Not available' };
        }
    }

    async isEmailAvailable(email: string) {
        const isAvailable = await this.userService.findOne({ email });
        if (isAvailable) {
            return { success: true, message: 'Already available' };
        } else {
            return { success: false, message: 'Not available' };
        }
    }

    // --------- ADMIN --------------

    async validateAdminByPassword(
        loginAttempt: LoginUserInput,
        IpAddress
    ): Promise<LoginResult | undefined> {
        // This will be used for the initial login
        let userToAttempt: UserDocument | undefined;
        if (loginAttempt.email) {
            userToAttempt = await this.userService.userModel
                .findOne({
                    $or: [
                        { email: loginAttempt.email },
                        { userName: loginAttempt.email.toLowerCase() }
                    ]
                })
                .exec();
        }
        if (!userToAttempt?.roles?.includes(ERole.ADMIN)) return undefined;
        // If the user is not enabled, disable log in - the token wouldn't work anyways
        if (userToAttempt && userToAttempt.isActive === false)
            userToAttempt = undefined;

        if (!userToAttempt) return undefined;

        // if(!userToAttempt.isEmailVerified) throw new Error('You must varify your email address')
        // will do later when email verify api will work properly
        // Check the supplied password against the hash stored for this email address
        let isMatch = false;
        try {
            isMatch = await userToAttempt.checkPassword(loginAttempt.password);
        } catch (error) {
            return undefined;
        }

        if (isMatch) {
            if (userToAttempt.settings.twoFa) {
                await this.userService.send2FaVerificationCode(
                    userToAttempt?._id,
                    userToAttempt?.email,
                    userToAttempt?.firstName
                );

                const jwt = await this.jwtService.signAsync(
                    {
                        _id: userToAttempt._id,
                        email: userToAttempt.email,
                        twoFa: userToAttempt?.settings?.twoFa,
                        temp: true
                    },
                    {
                        secret: jwtConstants.secret,
                        expiresIn: 60 * 15
                    }
                );
                return {
                    access_token: jwt,
                    user: null,
                    twoFa: userToAttempt?.settings?.twoFa
                };
            } else {
                // If there is a successful match, generate a JWT for the user
                const result: LoginResult = await this.createJwt(
                    userToAttempt,
                    IpAddress
                );
                // userToAttempt.timestamp = new Date();
                // userToAttempt.save();
                return result;
            }
        }

        return undefined;
    }

    async rw_loginById(id: Types.ObjectId, IpAddress): Promise<RWLoginResult> {
        const user = await this.userService.userModel.findOne({
            _id: id
        });
        if (!user) {
            throw new Error('User does not exists.');
        }

        await this.userService.findOneAndUpdate(
            { _id: user._id },
            { lastLogin: new Date() }
        );

        await this.ipAddressService.create(user._id, IpAddress);

        const jwt = await this.jwtService.signAsync(
            {
                email: user.email,
                _id: user._id
            },
            {
                secret: jwtConstants.secret,
                expiresIn: jwtConstants.expire
            }
        );

        return {
            user: user,
            access_token: jwt
        };
    }

    // password protection
    async invitationCodeVerify(id, code, IpAddress) {
        const referral = await this.userService.findOne({
            invitation_code: code
        });

        if (referral) {
            const unique_code = Array.from(
                { length: 5 },
                () =>
                    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[
                        Math.floor(Math.random() * 36)
                    ]
            ).join('');

            // password protection
            const createUser = await this.userService.findOneAndUpdate(
                { _id: id },
                {
                    referral: referral._id,
                    invitation_code: unique_code,
                    affiliatedUser: true
                }
            );
            const result: LoginResult = await this.createJwt(
                createUser,
                IpAddress
            );

            // 1,000 points per affiliate

            await this.scoresService.createScore(referral._id, 'affiliate');

            if (referral) {
                await this.referralService.add(referral?._id, createUser?._id);
                const url = `${process.env.FRONT_BASE_URL}/invite`;
                this.emailService.sendReferralEmail(
                    referral.email,
                    createUser?.firstName + ' ' + createUser?.lastName,
                    url
                );

                await this.notificationModel.create({
                    type: NotificationType.SYSTEM,
                    sender: ENotificationFromType.APP,
                    message: `@${createUser.userName} has joined via invite code`,
                    receiver: referral._id
                });
            }

            return result;
        } else {
            throw new Error('This code is not valid');
        }
    }
}
