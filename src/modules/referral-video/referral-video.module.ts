import { Module } from '@nestjs/common';
import { ReferralVideoService } from './referral-video.service';
import { ReferralVideoResolver } from './referral-video.resolver';
import { CommonModule } from '../common/common.module';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { AppGateway } from 'src/app.gateway';
import { HashtagsService } from '../feeds/hashtags.service';
import { ScoresService } from '../scores/scores.service';
import { CollectionsService } from '../collections/collections.service';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { ReservoirService } from '../shared/services/reservoir.service';
import { NftsService } from '../nfts/nfts.service';

@Module({
    imports: [CommonModule],
    providers: [
        ReferralVideoResolver,
        ReferralVideoService,
        JwtService,
        UsersService,
        VerificationService,
        EmailService,
        AppGateway,
        HashtagsService,
        ScoresService,
        CollectionsService,
        ReservoirService,
        RedisPubSubService,
        NftsService,
        sharedEmitterProvider
    ]
})
export class ReferralVideoModule {}
