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

@Controller('auth')
export class AuthController {
    constructor(
        private readonly linkedinService: LinkedinService,
        private readonly userService: UsersService,
        private readonly cloud: CloudinaryService
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
        const { user, token } = req.user;
        console.log(user && !token);

        if (user && !token) {
            // Redirect to the frontend site
            return res.redirect(`${process.env.FRONT_BASE_URL}?twitter=true`);
        } else {
            console.log('called');

            // Create session for authenticated user
            req.session.user = user;
            req.session.isAuthenticated = true;

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
            return res.redirect(process.env.FRONT_BASE_URL);
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

            return res.redirect(`${process.env.FRONT_BASE_URL}?linkedin=true`);
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
            const verification = updateBody.verification;

            const user = await this.userService.kycVerifyCompleted(
                verification.vendorData,
                verification.code,
                verification?.document
            );
            return res.json({
                message: 'user status changed.',
                user,
                status: HttpStatus.OK,
                res
            });
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
