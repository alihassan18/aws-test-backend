import { Module } from '@nestjs/common';
import { RwEventsService } from './rw_events.service';
import { RwEventsResolver } from './rw_events.resolver';
import { CommonModule } from '../common/common.module';
import { VerificationService } from '../verification/verification.service';
import { JwtService } from '@nestjs/jwt';
import { AppGateway } from 'src/app.gateway';
import { HashtagsService } from '../feeds/hashtags.service';
import { ReferralVideoService } from '../referral-video/referral-video.service';
import { ReferralService } from '../referral/referral.service';
import { ScoresService } from '../scores/scores.service';
import { EmailService } from '../shared/services/email.service';
import { UsersService } from '../users/users.service';
import { CollectionsService } from '../collections/collections.service';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { ReservoirService } from '../shared/services/reservoir.service';
import { NftsService } from '../nfts/nfts.service';

@Module({
    imports: [CommonModule],
    providers: [
        RwEventsResolver,
        RwEventsService,
        JwtService,
        UsersService,
        VerificationService,
        EmailService,
        AppGateway,
        HashtagsService,
        ScoresService,
        ReferralService,
        ReferralVideoService,
        CollectionsService,
        ReservoirService,
        RedisPubSubService,
        NftsService,
        sharedEmitterProvider
    ]
})
export class RwEventsModule {}
