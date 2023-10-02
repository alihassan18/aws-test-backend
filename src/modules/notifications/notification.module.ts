import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { CommonModule } from '../common/common.module';
import { UsersService } from '../users/users.service';
import { EmailService } from '../shared/services/email.service';
import { AppGateway } from 'src/app.gateway';
import { VerificationService } from '../verification/verification.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { PrivateFeedsGateway } from '../gateways/private/private-feeds.gateway';
import { AuthService } from '../auth/auth.service';
import { ReferralService } from 'src/modules/referral/referral.service';
import { TwitterStrategy } from '../auth/strategies/twitter.strategy';
import { HashtagsService } from '../feeds/hashtags.service';
import { PublicUserGateway } from '../gateways/public/public-user.gateway';
import { PostService } from '../feeds/posts.service';
import { FeedsService } from '../feeds/feeds.service';
import { LinkedinService } from '../social/linkedin.service';
import { HttpModule } from '@nestjs/axios';
import { ScoresService } from '../scores/scores.service';
import { ReferralVideoService } from '../referral-video/referral-video.service';
import { CollectionsService } from '../collections/collections.service';
import { ReservoirService } from '../shared/services/reservoir.service';
import { GatewaysModule } from '../gateways/gateways.module';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { IpAddressService } from '../ip-address/ip-address.service';
import { LandmapService } from '../landmap/landmap.service';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { NftsService } from '../nfts/nfts.service';

@Module({
    imports: [CommonModule, HttpModule, GatewaysModule],
    providers: [
        RedisPubSubService,
        PublicUserGateway,
        NotificationResolver,
        NotificationService,
        UsersService,
        AppGateway,
        VerificationService,
        EmailService,
        AuthGuard,
        JwtService,
        PrivateFeedsGateway,
        AuthService,
        ReferralService,
        TwitterStrategy,
        HashtagsService,
        PostService,
        FeedsService,
        LinkedinService,
        ScoresService,
        ReferralVideoService,
        CollectionsService,
        ReservoirService,
        sharedEmitterProvider,
        IpAddressService,
        LandmapService,
        NftsService
    ],
    exports: [NotificationService]
})
export class NotificationModule {}
