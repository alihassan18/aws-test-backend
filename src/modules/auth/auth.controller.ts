// auth.controller.ts
import {
    Controller,
    Get,
    Query,
    Req,
    Res,
    UseGuards,
    Post,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Body,
    HttpStatus
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthGuard as JwtAuthGuard } from '../auth/auth.guard';
import { FacebookAuthGuard } from './guards/facebook.auth.guard';
import { TwitterAuthGuard } from './guards/twitter.auth.guard';
import { LinkedinService } from '../social/linkedin.service';
import { UsersService } from '../users/users.service';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { jwtConstants } from 'src/constants/jwt.constant';
// import { auth, Client } from 'twitter-api-sdk';

// const authClient = new auth.OAuth2User({
//     client_id: 'dGpXN2c3eDFqelM1VXM1eldjZTU6MTpjaQ',
//     client_secret: 'o9F4F-NjGeCe4Eh2I-QqvHZGBOzaOhz9fIa6_aVh32zTHLwi0t',
//     callback: 'http://localhost:3000/auth/twitter-auth-callback',
//     scopes: ['tweet.read', 'users.read', 'offline.access']
// });
@Controller('auth')
export class AuthController {
    constructor(
        private readonly linkedinService: LinkedinService,
        private readonly userService: UsersService,
        private readonly cloud: CloudinaryService,
        private readonly jwtService: JwtService,
        private readonly authService: AuthService
    ) {}

    @Get('twitter')
    @UseGuards(TwitterAuthGuard)
    async twitterAuth(@Req() req) {
        req.session.token = req.query.token;
    }

    // @Get('twitter-auth')
    // async twitter_Auth(@Req() req, @Res() res) {
    //     try {
    //         // console.log("call twitter");

    //         // // const twitter = new Twitter({
    //         // //     consumerKey: 'dGpXN2c3eDFqelM1VXM1eldjZTU6MTpjaQ',
    //         // //     consumerSecret:
    //         // //         'o9F4F-NjGeCe4Eh2I-QqvHZGBOzaOhz9fIa6_aVh32zTHLwi0t'
    //         // // });

    //         // const twitterConfig: AuthClient = {
    //         //     consumerKey: 'dGpXN2c3eDFqelM1VXM1eldjZTU6MTpjaQ',
    //         //     consumerSecret: 'o9F4F-NjGeCe4Eh2I-QqvHZGBOzaOhz9fIa6_aVh32zTHLwi0t',
    //         //   };

    //         //   const twitter = new Twitter(twitterConfig);

    //         // const redirectURL = 'https://55b4-182-185-214-32.ngrok-free.app/';
    //         // const requestToken = twitter.getRequestToken(redirectURL);

    //         // // Store the request token in your session for later use
    //         // req.session.twitterRequestToken = requestToken;

    //         // // Redirect the user to the Twitter login page
    //         // res.redirect(twitter.getAuthUrl(requestToken));

    //         // const authClient = new auth.OAuth2User({
    //         //     client_id: 'dGpXN2c3eDFqelM1VXM1eldjZTU6MTpjaQ',
    //         //     client_secret:
    //         //         'o9F4F-NjGeCe4Eh2I-QqvHZGBOzaOhz9fIa6_aVh32zTHLwi0t',
    //         //     callback: 'https://55b4-182-185-214-32.ngrok-free.app/',
    //         //     scopes: ['tweet.read', 'users.read', 'offline.access']
    //         // });

    //         const authUrl = await authClient.generateAuthURL({
    //             code_challenge_method: 's256',
    //             state: 'twitter-increaser-state',
    //         });

    //         console.log(authUrl, 'client');
    //         res.redirect(authUrl);

    //         // const reqAccessToken = await authClient.requestAccessToken(
    //         //     'VndqdEpxZkQ0X1NIU1dkRElMRWlITWt5b2h0ZUJlSXB4YW9zb3puaW8wNzgtOjE2OTgxNTgyMjgzNzc6MTowOmFjOjE'
    //         // );
    //     } catch (error) {
    //         console.log(error, 'error in twitter');
    //     }
    // }

    // @Get('twitter-auth-callback')
    // async twitter_Auth_callback(@Req() req, @Res() res) {
    //     console.log('call twitter-auth-callback', req.query);

    //     let token = req.query.code;
    //     const reqAccessToken = await authClient.requestAccessToken(token);
    //     const client = new Client(authClient);

    //     const data = await client.users.findMyUser({"user.fields": ["id", "location", "name", "pinned_tweet_id", "profile_image_url"]});

    //     console.log(reqAccessToken, 'reqAccessToken', data);
    // }

    @Get('twitter/callback')
    @UseGuards(AuthGuard('twitter'))
    async twitterCallback(@Req() req, @Res() res) {
        // Handle user authentication and create a session
        // This will depend on your specific application requirements
        req.session.token = '';
        const { user, token, isUserLogin } = req.user;

        if (user && !token) {
            // Redirect to the frontend site
            return res.redirect(`${process.env.FRONT_BASE_URL}?twitter=true`);
        } else {
            console.log('called');

            // Create session for authenticated user
            req.session.user = user;
            req.session.isAuthenticated = true;

            // Set the authentication token as a cookie on the response object
            // res.cookie('jwt', token, {
            //     httpOnly: true,
            //     secure: true, // enable this for HTTPS connections
            //     expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // set the expiration time to 1 day from now
            // });
            // // Set the authentication token as a cookie on the response object
            // res.cookie('user', JSON.stringify(user), {
            //     httpOnly: true,
            //     secure: true, // enable this for HTTPS connections
            //     expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // set the expiration time to 1 day from now
            // });

            // Redirect to the frontend site
            if (isUserLogin) {
                return res.redirect(process.env.FRONT_BASE_URL);
            } else {
                if (user && user.settings.twoFa) {
                    await this.userService.send2FaVerificationCode(
                        user?._id,
                        user?.email,
                        user?.firstName
                    );

                    const jwt = await this.jwtService.signAsync(
                        {
                            _id: user._id,
                            email: user.email,
                            twoFa: user?.settings?.twoFa,
                            key: user?.key,
                            temp: true
                        },
                        {
                            secret: jwtConstants.secret,
                            expiresIn: 60 * 15
                        }
                    );
                    res.redirect(
                        `${
                            process.env.FRONT_BASE_URL
                        }/?twitter_login=true&user_token=${jwt}&two_fa=${
                            user?.settings?.twoFa ? 'true' : 'false'
                        }`
                    );
                    // return {
                    //     access_token: jwt,
                    //     user: null,
                    //     twoFa: user?.settings?.twoFa
                    // };
                } else {
                    const loggedUser = await this.authService.createJwt(user);

                    if (loggedUser?.user?.isBlocked === true) {
                        // return {
                        //     message: this.messages.userBlocked,
                        //     success: false,
                        //     status: HttpStatus.FORBIDDEN
                        // };
                        return res.redirect(process.env.FRONT_BASE_URL);

                        // ---------------------------
                    }
                    // password protection

                    if (!loggedUser.user?.invitation_code) {
                        // return {
                        //     notAffiliated: true,
                        //     user: null,
                        //     access_token: loggedUser.access_token
                        // };
                        return res.redirect(
                            `${process.env.FRONT_BASE_URL}/?twitter_login=true&user_token=${loggedUser.access_token}&not_affiliated=true`
                        );
                    }
                    return res.redirect(
                        `${
                            process.env.FRONT_BASE_URL
                        }/?twitter_user=${encodeURIComponent(
                            JSON.stringify(loggedUser.user)
                        )}&twitter_login=true&not_affiliated=false&user_token=${
                            loggedUser.access_token
                        }`
                    );

                    // return { ...loggedUser, notAffiliated: false };
                }
            }
        }
    }

    @Get('facebook')
    @UseGuards(FacebookAuthGuard)
    async facebookLogin() {
        // This route handler is not called, since the FacebookAuthGuard redirects to Facebook for authentication
    }

    @Get('facebook/callback')
    @UseGuards(FacebookAuthGuard)
    async facebookLoginCallback(@Req() req, @Res() res) {
        // Handle user authentication and create a session
        // This will depend on your specific application requirements
        const { user, token } = req.user;

        // Set the authentication token as a cookie on the response object
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: true, // enable this for HTTPS connections
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // set the expiration time to 1 day from now
        });
        // Set the authentication token as a cookie on the response object
        res.cookie('user', JSON.stringify(user), {
            httpOnly: true,
            secure: true, // enable this for HTTPS connections
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // set the expiration time to 1 day from now
        });

        // Redirect to the frontend site
        res.redirect(process.env.FRONT_BASE_URL);
    }

    @UseGuards(JwtAuthGuard)
    @Get('linkedin')
    async getLinkedInAuthUrl(@Req() req, @Res() res) {
        try {
            console.log(req.user);

            const user = req.user;
            const url = await this.linkedinService.getLinkedInAuthUrl(user._id);

            req.session.userId = user._id;
            res.json({ url: `${url}` });
            // res.json({ url: `${url}?userId=${user?._id}` });
        } catch (error) {
            console.log('Linked in auth arror', error);
        }
    }

    @Get('linkedin/callback')
    async postOnLinkedIn(
        @Query('code') code: string,
        @Query('state') state: string,
        @Req() req,
        @Res() res
    ) {
        try {
            const accessToken = await this.linkedinService.getAccessToken(code);
            const userId = state;
            if (accessToken) {
                const user = await this.userService.userModel
                    .findByIdAndUpdate(
                        new Types.ObjectId(userId),
                        {
                            linkedAccessToken: accessToken,
                            isLinkedInConnected: true
                        },
                        { new: true }
                    )
                    .exec();
                user.settings.isLinkedInEnabled = true;
                await user.save();
            }
            const redirectUrl = accessToken
                ? `${process.env.FRONT_BASE_URL}?linkedin=true`
                : `${process.env.FRONT_BASE_URL}`;
            return res.redirect(redirectUrl);
        } catch (error) {
            console.log('Error in linkedin callback', error);
        }
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        try {
            const res = await this.cloud.uploadFile(file);
            // console.log(res, 'response of cloudeinry');
            if (res.secure_url) {
                return res.secure_url;
            }
        } catch (error) {
            console.log(error, 'error in cloudeinry');
            throw new BadRequestException('Invalid file type.');
        }
    }

    // ------------ KYC VERIFICATION -------------

    @Post('kyc-verify')
    async verify(@Body() updateBody, @Res() res) {
        try {
            const email = updateBody.vendorData;
            const code = updateBody.code;
            const user = await this.userService.kycVerify(email, code);
            if (user) {
                return res.json({
                    message: 'user status changed.',
                    user,
                    status: HttpStatus.OK,
                    res
                });
            }
            return res.json({
                message: 'No status found',
                user,
                status: HttpStatus.OK,
                res
            });
        } catch (error) {
            return res.json({
                message: 'Internal server Error',
                user: {},
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                res
            });
        }
    }
    @Post('kyc-verify-completion')
    async verifyCompletion(@Body() updateBody, @Res() res) {
        try {
            console.log(updateBody, 'response from veriff');

            const verification = updateBody.verification;

            await this.userService.kycVerifyCompleted(
                verification.vendorData,
                verification.code
                // verification?.document
            );
            return res.status(200).send();
            //  res.json({
            //     message: 'user status changed.',
            //     user,
            //     status: HttpStatus.OK,
            //     res
            // });
        } catch (error) {
            return res.json({
                message: 'Internal server Error.',
                user: {},
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                res
            });
        }
    }

    // ------------ KYC VERIFICATION COMPLETED -------------

    // @Get('apple')
    // @UseGuards(AuthGuard('apple'))
    // async appleAuth(@Req() req) {
    //     console.log(req);
    //     console.log('Apple login initiated');
    // }

    // @Get('apple/callback')
    // @UseGuards(AuthGuard('apple'))
    // async appleAuthCallback(@Req() req, @Res() res) {
    //     // Handle successful authentication here (e.g., set a JWT)
    //     res.redirect(process.env.FRONT_BASE_URL);
    // }
}
