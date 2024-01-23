import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/jwt.constant';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { CommonModule } from 'src/modules/common/common.module';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { AppGateway } from 'src/app.gateway';
import { TwitterStrategy } from './strategies/twitter.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { StoreTokenMiddleware } from './store-token.middleware';
import { HttpModule } from '@nestjs/axios';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
@Module({
    imports: [
        HttpModule,
        CommonModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: jwtConstants.expire }
        })
    ],
    providers: [
        AuthResolver,
        AuthService,
        JwtService,
        UsersService,
        VerificationService,
        EmailService,
        AppGateway,
        TwitterStrategy,
        FacebookStrategy,
        CloudinaryService,
        sharedEmitterProvider
    ],
    exports: [
        AuthService,
        JwtService,
        UsersService,
        VerificationService,
        EmailService,
        AppGateway,
        TwitterStrategy,
        FacebookStrategy
    ]
})
export class AuthModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(StoreTokenMiddleware)
            .forRoutes({ path: 'auth/twitter', method: RequestMethod.GET });
    }
}
