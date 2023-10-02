import { Module } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CommonModule } from '../common/common.module';
import { AppGateway } from 'src/app.gateway';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { PostResolver } from './post.resolver';
import { FeedsResolver } from './feeds.resolver';
import { HashtagsResolver } from './hashtags.resolver';
import { PostService } from './posts.service';
import { HashtagsService } from './hashtags.service';
import { NotificationService } from '../notifications/notification.service';
import { PrivateFeedsGateway } from '../gateways/private/private-feeds.gateway';
import { AuthService } from '../auth/auth.service';
import { ReferralService } from 'src/modules/referral/referral.service';
import { TwitterStrategy } from '../auth/strategies/twitter.strategy';
import { LinkedinService } from '../social/linkedin.service';
import { HttpModule } from '@nestjs/axios';
import { CollectionsService } from '../collections/collections.service';
import { ScoresService } from '../scores/scores.service';
import { ReferralVideoService } from '../referral-video/referral-video.service';
import { StakingCollectionService } from '../staking/staking.service';
import { LandmapService } from '../landmap/landmap.service';
import { ReservoirService } from '../shared/services/reservoir.service';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { IpAddressService } from '../ip-address/ip-address.service';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { NftsService } from '../nfts/nfts.service';

@Module({
    imports: [CommonModule, HttpModule],
    providers: [
        RedisPubSubService,
        PostResolver,
        FeedsResolver,
        HashtagsResolver,
        FeedsService,
        PostService,
        HashtagsService,
        AuthGuard,
        JwtService,
        CollectionsService,
        // PublicUserGateway,
        UsersService,
        AppGateway,
        VerificationService,
        EmailService,
        // PublicFeedsGateway,
        NotificationService,
        PrivateFeedsGateway,
        AuthService,
        ReferralService,
        TwitterStrategy,
        LinkedinService,
        CollectionsService,
        ScoresService,
        ReferralVideoService,
        StakingCollectionService,
        LandmapService,
        ReservoirService,
        NftsService,
        sharedEmitterProvider,
        IpAddressService
    ],
    exports: [
        FeedsService,
        PostService,
        HashtagsService,
        AuthGuard,
        JwtService,
        UsersService,
        AppGateway,
        VerificationService,
        EmailService,
        NotificationService
    ]
})
export class FeedsModule {}
