import { Module } from '@nestjs/common';
import { RwRaceLbService } from './rw_race-lb.service';
import { RwRaceLbResolver } from './rw_race-lb.resolver';
import { CommonModule } from '../common/common.module';
import { UsersService } from '../users/users.service';
import { AppGateway } from 'src/app.gateway';
import { HashtagsService } from '../feeds/hashtags.service';
import { NotificationService } from '../notifications/notification.service';
import { ReferralVideoService } from '../referral-video/referral-video.service';
import { ScoresService } from '../scores/scores.service';
import { EmailService } from '../shared/services/email.service';
import { VerificationService } from '../verification/verification.service';
import { CollectionsService } from '../collections/collections.service';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { ReservoirService } from '../shared/services/reservoir.service';
import { NftsService } from '../nfts/nfts.service';

@Module({
    imports: [CommonModule],
    providers: [
        RwRaceLbResolver,
        RwRaceLbService,
        UsersService,
        NotificationService,
        VerificationService,
        EmailService,
        AppGateway,
        HashtagsService,
        ScoresService,
        ReferralVideoService,
        CollectionsService,
        ReservoirService,
        RedisPubSubService,
        NftsService,
        sharedEmitterProvider
    ]
})
export class RwRaceLbModule {}
