import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import {
    LoginResult,
    LoginUserInput,
    SignInInput,
    SignOutResult,
    EmailSentResult,
    LoginGoogleInput,
    LoginGoogleOutput,
    VerifyCodeInput,
    VerifyCodeOutput,
    ResetPasswordInput,
    VerifyEmailOutput,
    RWLoginResult,
    Verify2FAOutput
} from 'src/modules/users/dto/users.input';
import { BadRequestException, HttpStatus, UseGuards } from '@nestjs/common';
import { CommonServices } from '../shared/services/common.service';
import { AuthGuard } from './auth.guard';
import { ContextProps } from 'src/interfaces/common.interface';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IpAddress } from './dto/create-auth.input';

@Resolver(() => Auth)
export class AuthResolver extends CommonServices {
    constructor(private readonly authService: AuthService) {
        super();
    }

    @Mutation(() => LoginResult)
    async login(
        @Args('user') user: LoginUserInput,
        @IpAddress() IpAddress
    ): Promise<LoginResult | undefined> {
        const result = await this.authService.validateUserByPassword(
            user,
            IpAddress
        );

        if (result) return result;
        throw new BadRequestException('Incorrect email or password');
    }

    @Mutation(() => SignOutResult)
    async signup(
        @Args('data') data: SignInInput,
        @IpAddress() IpAddress
    ): Promise<SignOutResult | undefined> {
        const result = await this.authService.createUser(data, IpAddress);
        return result;
    }

    @Mutation(() => EmailSentResult)
    async passwordResetEmail(
        @Args('email') email: string
    ): Promise<EmailSentResult | undefined> {
        const data = await this.authService.sendPasswordResetEmail(email);
        if (data)
            return {
                message: this.messages.Success,
                success: true,
                status: HttpStatus.OK
            };
        throw new BadRequestException('Could not send email with the provided');
    }

    @Mutation(() => LoginGoogleOutput)
    async loginByGoogle(
        @Args('data') data: LoginGoogleInput,
        @IpAddress() IpAddress
    ): Promise<LoginGoogleOutput> {
        const user = await this.authService.googleLogin(data, IpAddress);
        if (user) return user;
        throw new BadRequestException('Could not send email with the provided');
    }

    @Mutation(() => String)
    async sendPasswordResetEmail(
        @Args('email') email: string
    ): Promise<string | undefined> {
        const user = await this.authService.sendPasswordResetEmail(email);
        if (user) return;
        throw new BadRequestException('Could not send email with the provided');
    }

    @Mutation(() => VerifyCodeOutput)
    async verifyCode(
        @Args('data') data: VerifyCodeInput
    ): Promise<VerifyCodeOutput | undefined> {
        const response = await this.authService.verifyCode(data);
        if (response) return response;
        throw new BadRequestException('Could not send email with the provided');
    }

    @Mutation(() => VerifyCodeOutput)
    async resetPassword(
        @Args('data') data: ResetPasswordInput
    ): Promise<VerifyCodeOutput | undefined> {
        const response = await this.authService.resetPassword(data);
        if (response) return response;
        throw new BadRequestException('Could not send email with the provided');
    }

    @Mutation(() => VerifyEmailOutput)
    @UseGuards(AuthGuard)
    async verifyEmail(
        @Context() ctx: ContextProps,
        @IpAddress() IpAddress
    ): Promise<VerifyEmailOutput | undefined> {
        const response = await this.authService.verifyEmail(
            ctx.req.user._id,
            IpAddress
        );
        if (response) return response;
        throw new BadRequestException('Could not send email with the provided');
    }

    // --------- 2FA VERIFICATION -------------

    @Mutation(() => VerifyEmailOutput)
    @UseGuards(AuthGuard)
    async send2faCode(
        @Context() ctx: ContextProps
    ): Promise<VerifyEmailOutput | undefined> {
        const response = await this.authService.send2faCode(
            ctx.req.user._id,
            ctx.req.user.email
        );
        if (response) return response;
        throw new BadRequestException('Could not send email with the provided');
    }

    @Mutation(() => Verify2FAOutput)
    @UseGuards(AuthGuard)
    async verify2faCode(
        @Context() ctx: ContextProps,
        @Args('code') code: string
    ): Promise<Verify2FAOutput | undefined> {
        const response = await this.authService.verify2faCode({
            email: ctx.req.user.email,
            code: code,
            userId: ctx.req.user._id
        });
        if (response?.success) return response;
        throw new BadRequestException('Wrong authentication code');
    }

    // --------- 2FA LOGIN -------------

    @Mutation(() => LoginResult)
    @UseGuards(AuthGuard)
    async verify2faLogin(
        @Context() ctx: ContextProps,
        @Args('code') code: string,
        @IpAddress() IpAddress
    ): Promise<LoginResult | undefined> {
        const response = await this.authService.verify2faLogin(
            {
                email: ctx.req.user.email,
                code: code,
                userId: ctx.req.user._id
            },
            IpAddress
        );
        if (response) return response;
        throw new BadRequestException('Could not send email with the provided');
    }

    // --------- 3FA LOGIN -------------

    @Mutation(() => LoginResult)
    @UseGuards(AuthGuard)
    async verify3faLogin(
        @Context() ctx: ContextProps,
        @Args('code') code: string,
        @IpAddress() IpAddress
    ): Promise<LoginResult | undefined> {
        const response = await this.authService.verify3faLogin(
            {
                code: code,
                userId: ctx.req.user._id
            },
            IpAddress
        );

        if (response) return response;
        throw new BadRequestException('Code is not valid. Please try again');
    }

    // --------- DELETE ACCOUNT -------------

    @Mutation(() => VerifyEmailOutput)
    @UseGuards(AuthGuard)
    async deleteUserAccount(
        @Context() ctx: ContextProps
    ): Promise<VerifyEmailOutput | undefined> {
        const response = await this.authService.deleteUserAccount(
            ctx.req.user._id
        );
        if (response.success) return response;
        throw new BadRequestException(
            'Could not deleted account yet with the provided'
        );
    }

    @UseGuards(AuthGuard)
    @Mutation(() => String)
    async updatePassword(
        @Args('currentPassword') currentPassword: string,
        @Args('newPassword') newPassword: string,
        @Context() ctx: ContextProps
    ): Promise<string> {
        return this.authService.changePassword(
            ctx.req.user._id,
            currentPassword,
            newPassword
        );
    }

    @Query(() => VerifyEmailOutput)
    isUsernameAvailable(
        @Args('userName', { type: () => String }) userName: string
    ) {
        return this.authService.isUsernameAvailable(userName);
    }

    @Query(() => VerifyEmailOutput)
    isEmailAvailable(@Args('email', { type: () => String }) email: string) {
        return this.authService.isEmailAvailable(email);
    }

    // --------- ADMIN -------------

    @Mutation(() => LoginResult)
    async adminLogin(
        @Args('user') user: LoginUserInput,
        @IpAddress() IpAddress
    ): Promise<LoginResult | undefined> {
        const result = await this.authService.validateAdminByPassword(
            user,
            IpAddress
        );
        if (result) return result;
        throw new BadRequestException('Incorrect email or password');
    }

    // ---------- ruffy world ----------

    @Mutation(() => RWLoginResult)
    async rw_loginById(
        @Args('id', { type: () => String }) id: string,
        @IpAddress() IpAddress
    ): Promise<RWLoginResult | undefined> {
        const decode = await this.authService.validateToken(id);
        const result = await this.authService.rw_loginById(
            decode._id,
            IpAddress
        );
        if (result) return result;
        throw new BadRequestException('User not found');
    }

    // ---------- PASSWORD PROTECTION ----------
    @Mutation(() => LoginResult)
    @UseGuards(AuthGuard)
    async invitationCodeVerify(
        @Context() ctx: ContextProps,
        @Args('code', { type: () => String }) code: string,
        @IpAddress() IpAddress
    ): Promise<LoginResult | undefined> {
        const response = await this.authService.invitationCodeVerify(
            ctx.req.user._id,
            code,
            IpAddress
        );
        if (response) return response;
        throw new BadRequestException('This code is not valid');
    }
}
console.log(IpAddress);
