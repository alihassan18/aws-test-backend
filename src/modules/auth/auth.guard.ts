import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { jwtConstants } from 'src/constants/jwt.constant';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);

        const request = ctx.getContext().req;

        const token =
            this.extractTokenFromHeader(request) ||
            request?.body?.headers?.Authorization;

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret
            });

            const user = await this.userService.findById(payload?._id);

            if (
                payload?.temp &&
                (request.body.operationName?.toLowerCase() ==
                    'verify2falogin' ||
                    request.body.operationName?.toLowerCase() == 'send2facode')
            ) {
                request['user'] = user;
                return true;
            }

            if (user.settings.twoFa) {
                if (!payload.twoFa) {
                    throw new UnauthorizedException(
                        'Session expired please login again.'
                    );
                }
            }

            if (payload.key && user.key) {
                if (payload.key !== user.key) {
                    // throw new Error('You are blocked by admin kindly contact support');
                    throw new UnauthorizedException(
                        'Session expired please login again.'
                    );
                }
            }

            if (!user) {
                throw new UnauthorizedException();
            }

            // if(!user.isEmailVerified){
            //     throw new Error('You must varify your email address')
            // } will do later when email verify api will work properly

            if (user.isBlocked) {
                throw new Error('You are blocked from administrative');
            }

            if (user.isBanned) {
                throw new Error('You are banned from administrative');
            }

            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = user;
        } catch (error) {
            console.log('AuthGuard Error', error);

            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        try {
            const [type, token] =
                request?.headers?.authorization?.split(' ') ?? [];
            return type === 'Bearer' ? token : undefined;
        } catch (error) {
            console.log(error);
        }
    }
}
