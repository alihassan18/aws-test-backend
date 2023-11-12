import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { jwtConstants } from 'src/constants/jwt.constant';
import { Request } from 'express';
import { ROLES_KEY } from './role.decorator';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
        private reflector: Reflector
    ) { }

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
                    request.body.operationName?.toLowerCase() ==
                    'send2facode' ||
                    request.body.operationName?.toLowerCase() ==
                    'verify3falogin')
            ) {
                request['user'] = user;
                return true;
            } else if (payload?.temp) {
                throw new UnauthorizedException(
                    'Session expired please login again.'
                );
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

            // Check for role-based authorization
            const roles = this.reflector.get<string[]>(
                ROLES_KEY,
                context.getHandler()
            );

            //   let matchResult =roles.find((r)=>e)

            if (
                roles &&
                roles.length > 0 &&
                !roles.some((requiredRole) => user.roles.includes(requiredRole))
            ) {
                throw new UnauthorizedException('Insufficient privileges');
            }

            request['user'] = user; // Assign user to request object
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
