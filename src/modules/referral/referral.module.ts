import { Module } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { ReferralResolver } from './referral.resolver';
import { CommonModule } from 'src/modules/common/common.module';
import { UsersService } from '../users/users.service';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { AppGateway } from 'src/app.gateway';
import { HashtagsService } from '../feeds/hashtags.service';
import { JwtService } from '@nestjs/jwt';
import { ScoresService } from '../scores/scores.service';
import { ReferralVideoService } from '../referral-video/referral-video.service';
import { CollectionsService } from '../collections/collections.service';
import { ReservoirService } from '../shared/services/reservoir.service';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { NftsService } from '../nfts/nfts.service';
import { WithdrawRequestResolver } from './requests.resolver';

@Module({
    imports: [CommonModule],
    providers: [
        WithdrawRequestResolver,
        ReferralResolver,
        ReferralService,
        UsersService,
        VerificationService,
        EmailService,
        AppGateway,
        HashtagsService,
        JwtService,
        ScoresService,
        ReferralVideoService,
        CollectionsService,
        ReservoirService,
        RedisPubSubService,
        NftsService,
        sharedEmitterProvider
    ]
})
export class ReferralModule {}
