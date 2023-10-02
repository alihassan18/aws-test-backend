import { Module } from '@nestjs/common';
import { TimeSpentResolver } from './timespent.resolver';
import { TimeSpentService } from './timespent.service';
import { CommonModule } from '../common/common.module';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { AppGateway } from 'src/app.gateway';
// import { PublicFeedsGateway } from '../gateways/public/public-feeds.gateway';
import { FeedsService } from '../feeds/feeds.service';
import { HashtagsService } from '../feeds/hashtags.service';
import { PublicUserGateway } from '../gateways/public/public-user.gateway';
import { ScoresService } from '../scores/scores.service';
import { ReferralVideoService } from '../referral-video/referral-video.service';
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
        TimeSpentResolver,
        TimeSpentService,
        AuthGuard,
        JwtService,
        UsersService,
        VerificationService,
        EmailService,
        AppGateway,
        // PublicFeedsGateway,
        FeedsService,
        HashtagsService,
        ScoresService,
        ReferralVideoService,
        CollectionsService,
        ReservoirService,
        RedisPubSubService,
        NftsService,
        sharedEmitterProvider,
        NotificationService
    ]
})
export class TimespentModule {}
