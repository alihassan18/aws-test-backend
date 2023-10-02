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
import { ReferralService } from 'src/modules/referral/referral.service';
import { TwitterStrategy } from './strategies/twitter.strategy';
import { AuthController } from './auth.controller';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { StoreTokenMiddleware } from './store-token.middleware';
import { LinkedinService } from '../social/linkedin.service';
import { SocialModule } from '../social/social.module';
import { HttpModule } from '@nestjs/axios';
import { HashtagsService } from '../feeds/hashtags.service';
import { PublicUserGateway } from '../gateways/public/public-user.gateway';
import { ScoresService } from '../scores/scores.service';
import { ReferralVideoService } from '../referral-video/referral-video.service';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { IpAddressService } from '../ip-address/ip-address.service';
import { CollectionsService } from '../collections/collections.service';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { ReservoirService } from '../shared/services/reservoir.service';
import { NftsService } from '../nfts/nfts.service';
import { NotificationService } from '../notifications/notification.service';
// import { AppleStrategy } from './strategies/apple.strategy';
@Module({
    imports: [
        HttpModule,
        CommonModule,
        SocialModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: jwtConstants.expire }
        })
    ],
    controllers: [AuthController],
    providers: [
        AuthResolver,
        AuthService,
        JwtService,
        PublicUserGateway,
        UsersService,
        VerificationService,
        EmailService,
        ReferralService,
        AppGateway,
        TwitterStrategy,
        FacebookStrategy,
        LinkedinService,
        HashtagsService,
        ScoresService,
        ReferralVideoService,
        CloudinaryService,
        IpAddressService,
        CollectionsService,
        ReservoirService,
        RedisPubSubService,
        NftsService,
        sharedEmitterProvider,
        NotificationService
        // AppleStrategy
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
