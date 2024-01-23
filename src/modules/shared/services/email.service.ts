import { Injectable } from '@nestjs/common';
import { env } from 'process';
import axios from 'axios';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Model } from 'mongoose';
@Injectable()
export class EmailService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async isUserEmailEnabled(email: string, settingType: string) {
        const user = await this.userModel.findOne({ email }).exec();
        const settingKeys = settingType.split('.');
        const isSettingEnabled = settingKeys.reduce(
            (obj, key) => obj?.[key],
            user?.settings
        );
        return !!isSettingEnabled;
    }

    private profile =
        'https://www.mintstargram.tech/assets/images/avatars/userProfile.png';

    async MAIL_GUN(mailOptions) {
        try {
            const response = await axios?.post(
                `https://api.mailgun.net/v3/mail.mintstargram.tech/messages`,
                mailOptions,
                {
                    auth: {
                        username: env.FROM_EMAIL,
                        // password: 'key-4677ac069546e92c036ee514b8172a19'
                        password: env.FROM_EMAIL_PASSWORD
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            Logger.log(
                `Email successfully sent to: ${mailOptions.to}. of ${mailOptions.template} template`
            );

            return response;
        } catch (error) {
            Logger.warn(`Problem in sending email: ${error}`);
            throw error;
        }
    }

    async sendForgotPasswordEmail(to, code, name) {
        const mailOptions = {
            from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
            to: to,
            subject: 'Forgot Password Email!',
            template: 'forgot password',
            'h:X-Mailgun-Variables': JSON.stringify({ name: name, code: code })
        };
        return this.MAIL_GUN(mailOptions);
    }

    async sendVerificationCode(to, code, name) {
        const mailOptions = {
            from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
            to: to,
            subject: 'Two Factor Authentication Code',
            template: '2fa',
            'h:X-Mailgun-Variables': JSON.stringify({
                name: name,
                code: code
            })
        };
        console.log(code);
        return this.MAIL_GUN(mailOptions);
    }

    async sendVerifyEmail(email, userId, token) {
        const mailOptions = {
            from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
            to: email,
            subject: 'Email Verification',
            template: 'confirmation email',
            'h:X-Mailgun-Variables': JSON.stringify({
                userId,
                token,
                domain: process.env.FRONT_BASE_URL
            })
        };

        return this.MAIL_GUN(mailOptions);
    }

    async sendDeleteAccountMail(name, email) {
        console.log(name, email);
    }

    async sendFollowEmail(to, name, profile, url) {
        if (await this.isUserEmailEnabled(to, 'email.follow')) {
            const mailOptions = {
                from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
                to: to,
                subject: 'New Follower',
                template: 'follow me',
                'h:X-Mailgun-Variables': JSON.stringify({
                    name,
                    profile: profile ?? this.profile,
                    url
                })
            };
            return this.MAIL_GUN(mailOptions);
        }
    }
}
