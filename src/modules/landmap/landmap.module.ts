import { Module } from '@nestjs/common';
import { LandmapService } from './landmap.service';
import { CommonModule } from '../common/common.module';
import { UsersService } from '../users/users.service';
import { EmailService } from '../shared/services/email.service';
import { AppGateway } from 'src/app.gateway';
import { VerificationService } from '../verification/verification.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { ReferralService } from 'src/modules/referral/referral.service';
import { TwitterStrategy } from '../auth/strategies/twitter.strategy';
import { MrlandResolver } from './mrland.resolver';
import { IslandResolver } from './island.resolver';
import { PublicLandmapGateway } from '../gateways/public/public-landmap.gateway';
import { HashtagsService } from '../feeds/hashtags.service';
import { PublicUserGateway } from '../gateways/public/public-user.gateway';
import { ScoresService } from '../scores/scores.service';
import { ReferralVideoService } from '../referral-video/referral-video.service';
import { IpAddressService } from '../ip-address/ip-address.service';
import { CollectionsService } from '../collections/collections.service';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { ReservoirService } from '../shared/services/reservoir.service';
import { NftsService } from '../nfts/nfts.service';
import { NotificationService } from '../notifications/notification.service';

@Module({
    imports: [CommonModule],
    providers: [
        PublicUserGateway,
        UsersService,
        AppGateway,
        VerificationService,
        LandmapService,
        EmailService,
        AuthGuard,
        JwtService,
        PublicLandmapGateway,
        AuthService,
        ReferralService,
        TwitterStrategy,
        MrlandResolver,
        IslandResolver,
        HashtagsService,
        ScoresService,
        ReferralVideoService,
        IpAddressService,
        CollectionsService,
        ReservoirService,
        RedisPubSubService,
        NftsService,
        sharedEmitterProvider,
        NotificationService
    ],
    exports: [
        AuthGuard,
        JwtService,
        UsersService,
        AppGateway,
        VerificationService,
        EmailService
    ]
})
export class LandmapModule {}
