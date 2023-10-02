import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { CommonModule } from '../common/common.module';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { AppGateway } from 'src/app.gateway';
import { FeedsService } from '../feeds/feeds.service';
// import { PublicFeedsGateway } from '../gateways/public/public-feeds.gateway';
// import { GatewaysModule } from '../gateways/gateways.module';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { NotificationService } from '../notifications/notification.service';
import { PrivateFeedsGateway } from '../gateways/private/private-feeds.gateway';
import { AuthService } from '../auth/auth.service';
import { ReferralService } from 'src/modules/referral/referral.service';
import { TwitterStrategy } from '../auth/strategies/twitter.strategy';
import { HashtagsService } from '../feeds/hashtags.service';
import { PublicUserGateway } from '../gateways/public/public-user.gateway';
import { ScoresService } from '../scores/scores.service';
import { ReferralVideoService } from '../referral-video/referral-video.service';
import { CloudinaryService } from '../shared/services/cloudinary.service';
import { IpAddressService } from '../ip-address/ip-address.service';
import { CollectionsService } from '../collections/collections.service';
import { ReservoirService } from '../shared/services/reservoir.service';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { NftsService } from '../nfts/nfts.service';

@Module({
    imports: [CommonModule],
    providers: [
        UsersResolver,
        UsersService,
        AuthGuard,
        JwtService,
        HashtagsService,
        VerificationService,
        EmailService,
        AppGateway,
        FeedsService,
        // PublicFeedsGateway,

        sharedEmitterProvider,
        PublicUserGateway,
        // NotificationResolver,
        NotificationService,
        PrivateFeedsGateway,
        AuthService,
        ReferralService,
        TwitterStrategy,
        ScoresService,
        ReferralVideoService,
        CloudinaryService,
        IpAddressService,
        CollectionsService,
        ReservoirService,
        RedisPubSubService,
        NftsService
    ],
    exports: [
        UsersService,
        PublicUserGateway,
        AuthGuard,
        JwtService,
        AppGateway,
        FeedsService,
        NotificationService,
        ScoresService
    ]
})
export class UsersModule {}
