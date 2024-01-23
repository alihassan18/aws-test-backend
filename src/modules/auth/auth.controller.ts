// auth.controller.ts
import {
    Controller,
    Get,
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
import { FacebookAuthGuard } from './guards/facebook.auth.guard';
import { TwitterAuthGuard } from './guards/twitter.auth.guard';
import { UsersService } from '../users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { jwtConstants } from 'src/constants/jwt.constant';

@Controller('auth')
export class AuthController {
    constructor(
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
            const verification = updateBody.verification;

            await this.userService.kycVerifyCompleted(
                verification.vendorData,
                verification.code
            );
            return res.status(200).send();
        } catch (error) {
            return res.json({
                message: 'Internal server Error.',
                user: {},
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                res
            });
        }
    }
}
