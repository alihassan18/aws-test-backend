import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsResolver } from './collections.resolver';
import { CommonModule } from '../common/common.module';
import { UsersService } from '../users/users.service';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { AppGateway } from 'src/app.gateway';
import { HashtagsService } from '../feeds/hashtags.service';
import { FeedsService } from '../feeds/feeds.service';
import { ScoresService } from '../scores/scores.service';
import { ReferralVideoService } from '../referral-video/referral-video.service';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ReservoirService } from '../shared/services/reservoir.service';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { PubsubModule } from '../redis-pubsub/redis-pubsub.modules';
import { NftsService } from '../nfts/nfts.service';
import { NotificationService } from '../notifications/notification.service';
@Module({
    imports: [CommonModule, PubsubModule],
    providers: [
        // RedisPubSubService,
        // MySubscriberService,
        CollectionsResolver,
        CollectionsService,
        UsersService,
        // PublicUserGateway,
        VerificationService,
        EmailService,
        AppGateway,
        HashtagsService,
        // PublicFeedsGateway,
        FeedsService,
        ScoresService,
        ReferralVideoService,
        AuthGuard,
        JwtService,
        ReservoirService,
        NftsService,
        NotificationService,
        sharedEmitterProvider
    ],
    exports: [CollectionsService]
})
export class CollectionsModule {}
