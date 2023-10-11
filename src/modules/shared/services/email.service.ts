import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';
import { env } from 'process';
// import { bidNotification } from 'src/modules/templates/bid-notification';
// // import { commentNotification } from 'src/modules/templates/comment-notification';
// import { deleteAccountRequest } from 'src/modules/templates/delete-account-request';
// // import { confirmationEmail } from 'src/modules/templates/email-verification';
// // import { forgotPassword } from 'src/modules/templates/forgot-password';
// import { invitation_mintstargram } from 'src/modules/templates/invitation-mintstargram';
// import { mintedNFT } from 'src/modules/templates/minted-nft';
// import { offerAccepted } from 'src/modules/templates/offer-accepted';
// import { offerReceived } from 'src/modules/templates/offer-received';
// import { offerRejected } from 'src/modules/templates/offer-rejected';
// import { offerSent } from 'src/modules/templates/offer-sent';
// import {
//     onBidPlaced,
//     onBidRecieved,
//     onBoughtNFT,
//     onSoldNFT
// } from 'src/modules/templates/on-bid-revieved';
// import { rwConfirmationEmail } from 'src/modules/templates/rw-email-verification';
// import { stageInvite } from 'src/modules/templates/stage-invite';
// import { twoFACode } from 'src/modules/templates/two-fa-code';
import axios from 'axios';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Model } from 'mongoose';
import { convertHashesMentionsToSimpleText } from 'src/helpers/common.helpers';

// const transporter = nodemailer.createTransport({
//     host: 'smtp.mailgun.org',
//     port: 587,
//     auth: {
//         user: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
//         pass: env.FROM_EMAIL_PASSWORD
//     }
// });

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

    async sendRWVerifyEmail(email, userId, token, firstName) {
        console.log(email, userId, token, firstName);

        // return new Promise((resolve, reject) => {
        //     const domain = process.env.FRONT_BASE_URL;
        //     const mailOptions = {
        //         from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
        //         to: email,
        //         subject: 'Ruffy World Email Verification',
        //         html: rwConfirmationEmail(userId, token, domain, firstName)
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             reject(error);
        //         } else {
        //             console.log(info);
        //             resolve(info);
        //         }
        //     });
        // });
    }

    async sendDeleteAccountMail(name, email) {
        console.log(name, email);

        // return new Promise((resolve, reject) => {
        //     const mailOptions = {
        //         from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
        //         to: process.env.CUSTOMER_SUPPORT_EMAIL,
        //         subject: 'Account Delete Request',
        //         html: deleteAccountRequest(name, email)
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //             reject(error);
        //         } else {
        //             console.log(info);
        //             resolve(info);
        //         }
        //     });
        // });
    }

    async sendBidRecievedEmail(email, url, title, image) {
        console.log(email, url, title, image);

        // return new Promise((resolve, reject) => {
        //     const mailOptions = {
        //         from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
        //         to: email,
        //         subject: 'Bidding Notification',
        //         html: onBidRecieved(title, image, url)
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //             reject(error);
        //         } else {
        //             console.log(info);
        //             resolve(info);
        //         }
        //     });
        // });
    }

    async sendNewBidRecievedEmail(email, url, price, currency, name, image) {
        console.log(email, url, price, currency, name, image);

        // return new Promise((resolve, reject) => {
        //     const mailOptions = {
        //         from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
        //         to: email,
        //         subject: 'Bidding Notification',
        //         html: bidNotification(price, currency, image, name, url)
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //             reject(error);
        //         } else {
        //             console.log(info);
        //             resolve(info);
        //         }
        //     });
        // });
    }
    async sendReferralEmail(email, name, url) {
        const mailOptions = {
            from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
            to: email,
            subject: 'Referral Notification',
            template: 'referral',
            'h:X-Mailgun-Variables': JSON.stringify({ name, url })
        };
        return this.MAIL_GUN(mailOptions);
        // return new Promise((resolve, reject) => {
        //     const mailOptions = {
        //         from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
        //         to: email,
        //         subject: 'Referral Notification',
        //         html: referral(name, url)
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //             reject(error);
        //         } else {
        //             console.log(info);
        //             resolve(info);
        //         }
        //     });
        // });
    }

    async sendBidPlacedEmail(emails, url, title, image) {
        console.log(emails, url, title, image);

        // return new Promise((resolve, reject) => {
        //     const mailOptions = {
        //         from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
        //         to: emails,
        //         subject: 'Bidding Notification',
        //         html: onBidPlaced(title, image, url)
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //             reject(error);
        //         } else {
        //             console.log(info);
        //             resolve(info);
        //         }
        //     });
        // });
    }

    async sendBoughtNftEmail(to, title, price, currency, image) {
        console.log(to, title, price, currency, image);

        // return new Promise((resolve, reject) => {
        //     const mailOptions = {
        //         from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
        //         to: to,
        //         subject: 'NFT Bought Successfully',
        //         html: onBoughtNFT(title, price, currency, image)
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //             reject(error);
        //         } else {
        //             console.log(info);
        //             resolve(info);
        //         }
        //     });
        // });
    }

    async sendSoldtNftEmail(to, title, price, currency, image) {
        console.log(to, title, price, currency, image);

        // return new Promise((resolve, reject) => {
        //     const mailOptions = {
        //         from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
        //         to: to,
        //         subject: 'NFT Sold Successfully',
        //         html: onSoldNFT(title, price, currency, image)
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //             reject(error);
        //         } else {
        //             console.log(info);
        //             resolve(info);
        //         }
        //     });
        // });
    }

    async sendOfferSentEmail(to, title, price, currency, image) {
        console.log(to, title, price, currency, image);

        // return new Promise((resolve, reject) => {
        //     const mailOptions = {
        //         from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
        //         to: to,
        //         subject: 'Offer Sent',
        //         html: offerSent(title, price, currency, image)
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //             reject(error);
        //         } else {
        //             console.log(info);
        //             resolve(info);
        //         }
        //     });
        // });
    }

    async sendOfferReceivedEmail(to, title, price, currency, image) {
        console.log(to, title, price, currency, image);

        // return new Promise((resolve, reject) => {
        //     const mailOptions = {
        //         from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
        //         to: to,
        //         subject: 'Offer Received',
        //         html: offerReceived(title, price, currency, image)
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //             reject(error);
        //         } else {
        //             console.log(info);
        //             resolve(info);
        //         }
        //     });
        // });
    }

    async sendAcceptOfferEmail(to, title, price, currency, image, url) {
        console.log(to, title, price, currency, image, url);

        // return new Promise((resolve, reject) => {
        //     const mailOptions = {
        //         from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
        //         to: to,
        //         subject: 'NFT Sold Successfully',
        //         html: offerAccepted(title, price, currency, image, url)
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //             reject(error);
        //         } else {
        //             console.log(info);
        //             resolve(info);
        //         }
        //     });
        // });
    }

    async sendOfferRejectEmail(to, title, price, currency, image) {
        console.log(to, title, price, currency, image);

        // return new Promise((resolve, reject) => {
        //     const mailOptions = {
        //         from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
        //         to: to,
        //         subject: 'Offer Rejected',
        //         html: offerRejected(title, price, currency, image)
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //             reject(error);
        //         } else {
        //             console.log(info);
        //             resolve(info);
        //         }
        //     });
        // });
    }

    async sendMintingEmail(email, name, image, url) {
        console.log(email, name, image, url);

        // return new Promise((resolve, reject) => {
        //     const mailOptions = {
        //         from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
        //         to: email,
        //         subject: 'Minting Notification',
        //         html: mintedNFT(name, image, url)
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //             reject(error);
        //         } else {
        //             console.log(info);
        //             resolve(info);
        //         }
        //     });
        // });
    }

    // OLD METHOD
    // async sendCommentEmail(
    //     email,
    //     displayName,
    //     profile,
    //     url,
    //     comment,
    //     createdAt
    // ) {
    //     return new Promise((resolve, reject) => {
    //         const mailOptions = {
    //             from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
    //             to: email,
    //             subject: 'Comment Notification',
    //             html: commentNotification(
    //                 displayName,
    //                 profile,
    //                 url,
    //                 comment,
    //                 createdAt
    //             )
    //         };
    //         transporter.sendMail(mailOptions, function (error, info) {
    //             if (error) {
    //                 console.log(error);
    //                 reject(error);
    //             } else {
    //                 console.log(info);
    //                 resolve(info);
    //             }
    //         });
    //     });
    // }

    async sendStageInvite(displayName, email, id, title, desc) {
        // return new Promise((resolve, reject) => {
        //     const mailOptions = {
        //         from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
        //         to: email,
        //         subject: 'Stage Notification',
        //         html: stageInvite(displayName, id, title, desc)
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //             reject(error);
        //         } else {
        //             console.log(info);
        //             resolve(info);
        //         }
        //     });
        // });

        const mailOptions = {
            from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
            to: email,
            subject: 'Stage Invitation',
            template: 'invite',
            'h:X-Mailgun-Variables': JSON.stringify({
                displayName: displayName,
                stageTitle: title,
                stageId: id,
                stageDesc: desc
            })
        };
        return this.MAIL_GUN(mailOptions);
    }

    async sendMintstargramInvite(email, username, code) {
        console.log(email, username, code);

        // return new Promise((resolve, reject) => {
        //     const mailOptions = {
        //         from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
        //         to: email,
        //         subject: 'Mintstargram Invitation',
        //         html: invitation_mintstargram(username, code)
        //     };
        //     transporter.sendMail(mailOptions, function (error, info) {
        //         if (error) {
        //             console.log(error);
        //             reject(error);
        //         } else {
        //             console.log(info);
        //             resolve(info);
        //         }
        //     });
        // });
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

    async sendLikePostEmail(to, name, profile, url) {
        if (await this.isUserEmailEnabled(to, 'email.like')) {
            const mailOptions = {
                from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
                to: to,
                subject: 'Reacted your Post',
                template: 'like post',
                'h:X-Mailgun-Variables': JSON.stringify({
                    name,
                    profile: profile ?? this.profile,
                    url
                })
            };
            return this.MAIL_GUN(mailOptions);
        }
    }

    async sendLikeCommentEmail(to, name, comment, url) {
        const text = convertHashesMentionsToSimpleText(comment);
        if (await this.isUserEmailEnabled(to, 'email.like')) {
            const mailOptions = {
                from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
                to: to,
                subject: 'Reacted your Comment',
                template: 'like react my comment',
                'h:X-Mailgun-Variables': JSON.stringify({
                    name,
                    comment: text,
                    url
                })
            };
            return this.MAIL_GUN(mailOptions);
        }
    }

    async sendCommentEmail(to, name, comment, url) {
        const text = convertHashesMentionsToSimpleText(comment);
        if (await this.isUserEmailEnabled(to, 'email.comment')) {
            const mailOptions = {
                from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
                to: to,
                subject: 'Comment',
                template: 'comment',
                'h:X-Mailgun-Variables': JSON.stringify({
                    name,
                    comment: text,
                    url
                })
            };
            return this.MAIL_GUN(mailOptions);
        }
    }

    async sendCommentReplyEmail(to, name, profile, url) {
        if (await this.isUserEmailEnabled(to, 'email.comment')) {
            const mailOptions = {
                from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
                to: to,
                subject: 'Reply your comment',
                template: 'comment my post',
                'h:X-Mailgun-Variables': JSON.stringify({
                    name,
                    profile: profile ?? this.profile,
                    url
                })
            };
            return this.MAIL_GUN(mailOptions);
        }
    }

    async sendRepostEmail(to, name, post, url) {
        const convertedtext = convertHashesMentionsToSimpleText(post);
        const mailOptions = {
            from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
            to: to,
            subject: 'Repost your post',
            template: 'repost',
            'h:X-Mailgun-Variables': JSON.stringify({
                name,
                post: convertedtext,
                url
            })
        };
        return this.MAIL_GUN(mailOptions);
    }

    async sendRepostCommentEmail(to, name, post, url) {
        if (await this.isUserEmailEnabled(to, 'email.comment')) {
            const convertedtext = convertHashesMentionsToSimpleText(post);
            const mailOptions = {
                from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
                to: to,
                subject: 'Repost your comment',
                template: 'repost my reply',
                'h:X-Mailgun-Variables': JSON.stringify({
                    name,
                    post: convertedtext,
                    url
                })
            };
            return this.MAIL_GUN(mailOptions);
        }
    }

    // -------- SEND THESE WITH FOLLOWERS

    async sendCreateNewPost_follower(to, name, text, url) {
        const convertedtext = convertHashesMentionsToSimpleText(text);
        const mailOptions = {
            from: `Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>`,
            to: 'notifications@mail.mintstargram.tech',
            bcc: to,
            subject: 'Create a new post',
            template: 'create a new post',
            'h:X-Mailgun-Variables': JSON.stringify({
                name,
                text: convertedtext,
                url
            })
        };
        return this.MAIL_GUN(mailOptions);
    }

    async sendCreateNewComment_follower(to, name, text, url) {
        const convertedtext = convertHashesMentionsToSimpleText(text);

        const mailOptions = {
            from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
            to: 'notifications@mail.mintstargram.tech',
            bcc: to,
            subject: 'Comment a post',
            template: 'comment somewhere',
            'h:X-Mailgun-Variables': JSON.stringify({
                name,
                text: convertedtext,
                url
            })
        };
        return this.MAIL_GUN(mailOptions);
    }

    async sendCreateNewRepost_follower(to, name, text, url) {
        const convertedtext = convertHashesMentionsToSimpleText(text);

        const mailOptions = {
            from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
            to: 'notifications@mail.mintstargram.tech',
            bcc: to,
            subject: 'Reposted',
            template: 'repost somewhere',
            'h:X-Mailgun-Variables': JSON.stringify({
                name,
                text: convertedtext,
                url
            })
        };
        return this.MAIL_GUN(mailOptions);
    }

    async sendCreateNewMintPost_follower(
        to,
        name,
        tokenId,
        tokenName,
        url,
        picture
    ) {
        const mailOptions = {
            from: 'Notifications | MintStargram.tech <notifications@mail.mintstargram.tech>',
            to: 'notifications@mail.mintstargram.tech',
            bcc: to,
            subject: 'Minted Post',
            template: 'mint post',
            'h:X-Mailgun-Variables': JSON.stringify({
                name,
                tokenId,
                tokenName,
                url,
                picture
            })
        };
        return this.MAIL_GUN(mailOptions);
    }
}
