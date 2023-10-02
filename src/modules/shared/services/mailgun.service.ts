// import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as fs from 'fs';
// import * as path from 'path';
// import * as handlebars from 'handlebars';
// import axios from 'axios';
// import { env } from 'process';

// // Define the interfaces and types if not already defined
// interface IMail {
//   to: string;
//   subject: string;
//   template?: string;
//   text?: string;
//   templateVariables?: Record<string, any>;
// }

// // interface MailInput {
// //   from: string;
// //   to: string;
// //   subject: string;
// //   html?: string;
// //   text?: string;
// // }

// @Injectable()
// export class MailService {
//   constructor(private readonly configService: ConfigService) {}

//   async sendMail(mail: IMail) {
//     const mailOptions = {
//       from: `SON <${env.FROM_EMAIL}>`,
//       to: 'khizarali621@gmail.com',
//       subject: "forgot mailgun",
//       template:'forgot password'
//     };

//     // if (mail.template) {
//     //   const emailTemplateSource = fs.readFileSync(
//     //     path.join(__dirname, `../../templates/${mail.template}.hbs`),
//     //     'utf8',
//     //   );
//     //   const template = handlebars.compile(emailTemplateSource);
//     //   const htmlToSend = template(mail.templateVariables);
//     //   mailOptions.html = htmlToSend;
//     // } else {
//     //   mailOptions.text = mail.text;
//     // }

//     try {
//       const body = Object.keys(mailOptions)
//         .map((key) => `${key}=${encodeURIComponent(mailOptions[key])}`)
//         .join('&');

//       const response = await axios.post(
//         `https://api.mailgun.net/v3/mail.mintstartgram.com/messages`,
//         body,
//         {
//           auth: {
//             username: env.FROM_EMAIL,
//             password: 'key-4677ac069546e92c036ee514b8172a19',
//           },
//           headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//         },
//       );

//       Logger.log(`Email successfully sent to: ${mail.to}.`);
//       return response;
//     } catch (error) {
//       Logger.warn(`Problem in sending email: ${error}`);
//       throw error;
//     }
//   }
// }

// --------------- OLD NODEMAILER EMAIL SERVICE ---------------
// import { Injectable } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';
// import { env } from 'process';
// import { bidNotification } from 'src/modules/templates/bid-notification';
// import { commentNotification } from 'src/modules/templates/comment-notification';
// import { deleteAccountRequest } from 'src/modules/templates/delete-account-request';
// import { confirmationEmail } from 'src/modules/templates/email-verification';
// import { forgotPassword } from 'src/modules/templates/forgot-password';
// import { invitation_mintstartgram } from 'src/modules/templates/invitation-mintstartgram';
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
// import { referral } from 'src/modules/templates/referral';
// import { rwConfirmationEmail } from 'src/modules/templates/rw-email-verification';
// import { stageInvite } from 'src/modules/templates/stage-invite';
// import { twoFACode } from 'src/modules/templates/two-fa-code';
// import axios from 'axios';
// import { Logger } from '@nestjs/common';

// const transporter = nodemailer.createTransport({
//     host: 'smtp.mailgun.org',
//     port: 587,
//     auth: {
//         user: env.FROM_EMAIL,
//         pass: env.FROM_EMAIL_PASSWORD
//     }
// });

// @Injectable()
// export class EmailService {
//     async MAIL_GUN(mailOptions) {
//         try {
//             const response = await axios.post(
//                 `https://api.mailgun.net/v3/mail.mintstartgram.com/messages`,
//                 mailOptions,
//                 {
//                     auth: {
//                         username: env.FROM_EMAIL,
//                         password: 'key-4677ac069546e92c036ee514b8172a19'
//                     },
//                     headers: {
//                         'Content-Type': 'application/x-www-form-urlencoded'
//                     }
//                 }
//             );

//             Logger.log(`Email successfully sent to: ${mailOptions.to}.`);
//             return response;
//         } catch (error) {
//             Logger.warn(`Problem in sending email: ${error}`);
//             throw error;
//         }
//     }

//     async sendForgotPasswordEmail(to, code, name) {
//         // return new Promise((resolve, reject) => {
//         //     const mailOptions = {
//         //         from: env.FROM_EMAIL,
//         //         to: to,
//         //         subject: 'Forgot Password Email!',
//         //         html: forgotPassword(name, code)
//         //     };

//         //     transporter.sendMail(mailOptions, function (error, info) {
//         //         if (error) {
//         //             console.log(error);
//         //             reject(error);
//         //         } else {
//         //             console.log(info);
//         //             resolve(info);
//         //         }
//         //     });
//         // });
//         // async sendMail(mail: IMail) {
//         const mailOptions = {
//             from: env.FROM_EMAIL,
//             to: to,
//             subject: 'Forgot Password Email!',
//             template: 'forgot password',
//             'h:X-Mailgun-Variables': JSON.stringify({ name: name, code: code })
//         };
//         return this.MAIL_GUN(mailOptions);
//     }

//     async sendVerificationCode(to, code, name) {
//         return new Promise((resolve, reject) => {
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: to,
//                 subject: 'Two Factor Authentication Code',
//                 html: twoFACode(name, code)
//             };

//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }

//     async sendVerifyEmail(email, userId, token) {
//         return new Promise((resolve, reject) => {
//             const domain = process.env.FRONT_BASE_URL;
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: email,
//                 subject: 'Email Verification',
//                 html: confirmationEmail(userId, token, domain)
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }

//     async sendRWVerifyEmail(email, userId, token, firstName) {
//         return new Promise((resolve, reject) => {
//             const domain = process.env.FRONT_BASE_URL;
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: email,
//                 subject: 'Ruffy World Email Verification',
//                 html: rwConfirmationEmail(userId, token, domain, firstName)
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }

//     async sendDeleteAccountMail(name, email) {
//         return new Promise((resolve, reject) => {
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: process.env.CUSTOMER_SUPPORT_EMAIL,
//                 subject: 'Account Delete Request',
//                 html: deleteAccountRequest(name, email)
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }

//     async sendBidRecievedEmail(email, url, title, image) {
//         return new Promise((resolve, reject) => {
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: email,
//                 subject: 'Bidding Notification',
//                 html: onBidRecieved(title, image, url)
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }

//     async sendNewBidRecievedEmail(email, url, price, currency, name, image) {
//         return new Promise((resolve, reject) => {
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: email,
//                 subject: 'Bidding Notification',
//                 html: bidNotification(price, currency, image, name, url)
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }
//     async sendReferralEmail(email, name, url) {
//         return new Promise((resolve, reject) => {
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: email,
//                 subject: 'Referral Notification',
//                 html: referral(name, url)
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }

//     async sendBidPlacedEmail(emails, url, title, image) {
//         return new Promise((resolve, reject) => {
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: emails,
//                 subject: 'Bidding Notification',
//                 html: onBidPlaced(title, image, url)
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }

//     async sendBoughtNftEmail(to, title, price, currency, image) {
//         console.log(image, price);

//         return new Promise((resolve, reject) => {
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: to,
//                 subject: 'NFT Bought Successfully',
//                 html: onBoughtNFT(title, price, currency, image)
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }

//     async sendSoldtNftEmail(to, title, price, currency, image) {
//         return new Promise((resolve, reject) => {
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: to,
//                 subject: 'NFT Sold Successfully',
//                 html: onSoldNFT(title, price, currency, image)
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }

//     async sendOfferSentEmail(to, title, price, currency, image) {
//         return new Promise((resolve, reject) => {
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: to,
//                 subject: 'Offer Sent',
//                 html: offerSent(title, price, currency, image)
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }

//     async sendOfferReceivedEmail(to, title, price, currency, image) {
//         return new Promise((resolve, reject) => {
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: to,
//                 subject: 'Offer Received',
//                 html: offerReceived(title, price, currency, image)
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }

//     async sendAcceptOfferEmail(to, title, price, currency, image, url) {
//         return new Promise((resolve, reject) => {
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: to,
//                 subject: 'NFT Sold Successfully',
//                 html: offerAccepted(title, price, currency, image, url)
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }

//     async sendOfferRejectEmail(to, title, price, currency, image) {
//         return new Promise((resolve, reject) => {
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: to,
//                 subject: 'Offer Rejected',
//                 html: offerRejected(title, price, currency, image)
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }

//     async sendMintingEmail(email, name, image, url) {
//         return new Promise((resolve, reject) => {
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: email,
//                 subject: 'Minting Notification',
//                 html: mintedNFT(name, image, url)
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }

//     async sendCommentEmail(
//         email,
//         displayName,
//         profile,
//         url,
//         comment,
//         createdAt
//     ) {
//         return new Promise((resolve, reject) => {
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: email,
//                 subject: 'Comment Notification',
//                 html: commentNotification(
//                     displayName,
//                     profile,
//                     url,
//                     comment,
//                     createdAt
//                 )
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }

//     async sendStageInvite(displayName, email, id, title, desc) {
//         return new Promise((resolve, reject) => {
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: email,
//                 subject: 'Stage Notification',
//                 html: stageInvite(displayName, id, title, desc)
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }

//     async sendMintstartgramInvite(email, username, code) {
//         return new Promise((resolve, reject) => {
//             const mailOptions = {
//                 from: env.FROM_EMAIL,
//                 to: email,
//                 subject: 'Mintstartgram Invitation',
//                 html: invitation_mintstartgram(username, code)
//             };
//             transporter.sendMail(mailOptions, function (error, info) {
//                 if (error) {
//                     console.log(error);
//                     reject(error);
//                 } else {
//                     console.log(info);
//                     resolve(info);
//                 }
//             });
//         });
//     }
// }
