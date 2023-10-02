import { Module } from '@nestjs/common';
import { ReactionService } from './reactions.service';
import { ReactionsResolver } from './reactions.resolver';
import { CommonModule } from '../common/common.module';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AppGateway } from 'src/app.gateway';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { FeedsService } from '../feeds/feeds.service';
import { NotificationService } from '../notifications/notification.service';
import { PrivateFeedsGateway } from '../gateways/private/private-feeds.gateway';
import { AuthService } from '../auth/auth.service';
import { ReferralService } from 'src/modules/referral/referral.service';
import { TwitterStrategy } from '../auth/strategies/twitter.strategy';
import { HashtagsService } from '../feeds/hashtags.service';
import { ScoresService } from '../scores/scores.service';
import { ReferralVideoService } from '../referral-video/referral-video.service';
import { IpAddressService } from '../ip-address/ip-address.service';
import { CollectionsService } from '../collections/collections.service';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { ReservoirService } from '../shared/services/reservoir.service';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { NftsService } from '../nfts/nfts.service';
// import { PublicUserGateway } from '../gateways/public/public-user.gateway';
@Module({
    imports: [CommonModule],
    providers: [
        // PublicUserGateway,
        ReactionsResolver,
        ReactionService,
        AuthGuard,
        JwtService,
        UsersService,
        AppGateway,
        VerificationService,
        EmailService,
        FeedsService,
        NotificationService,
        PrivateFeedsGateway,
        AuthService,
        ReferralService,
        TwitterStrategy,
        HashtagsService,
        ScoresService,
        ReferralVideoService,
        IpAddressService,
        CollectionsService,
        ReservoirService,
        RedisPubSubService,
        NftsService,
        sharedEmitterProvider
    ]
})
export class ReactionsModule {}
