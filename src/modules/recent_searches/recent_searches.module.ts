import { Module } from '@nestjs/common';
import { RecentSearchesService } from './recent_searches.service';
import { RecentSearchesResolver } from './recent_searches.resolver';
import { JwtService } from '@nestjs/jwt';
import { AppGateway } from 'src/app.gateway';
import { CollectionsService } from '../collections/collections.service';
import { CommonModule } from '../common/common.module';
import { HashtagsService } from '../feeds/hashtags.service';
import { NftsService } from '../nfts/nfts.service';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { ReferralVideoService } from '../referral-video/referral-video.service';
import { ReferralService } from '../referral/referral.service';
import { ScoresService } from '../scores/scores.service';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { EmailService } from '../shared/services/email.service';
import { ReservoirService } from '../shared/services/reservoir.service';
import { UsersService } from '../users/users.service';
import { VerificationService } from '../verification/verification.service';

@Module({
    imports: [CommonModule],
    providers: [
        RecentSearchesResolver,
        RecentSearchesService,
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
export class RecentSearchesModule {}
