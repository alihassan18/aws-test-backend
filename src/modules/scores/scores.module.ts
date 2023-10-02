import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { ScoresResolver } from './scores.resolver';
import { ScoresService } from './scores.service';
import { UsersService } from '../users/users.service';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { AppGateway } from 'src/app.gateway';
import { HashtagsService } from '../feeds/hashtags.service';
import { JwtService } from '@nestjs/jwt';
import { ReferralVideoService } from '../referral-video/referral-video.service';
import { CollectionsService } from '../collections/collections.service';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { ReservoirService } from '../shared/services/reservoir.service';
import { NftsService } from '../nfts/nfts.service';
// import { PublicUserGateway } from '../gateways/public/public-user.gateway';
@Module({
    imports: [CommonModule],
    providers: [
        ScoresResolver,
        ScoresService,
        UsersService,
        VerificationService,
        EmailService,
        AppGateway,
        HashtagsService,
        JwtService,
        ReferralVideoService,
        CollectionsService,
        ReservoirService,
        RedisPubSubService,
        NftsService,
        sharedEmitterProvider
    ],
    exports: [ScoresService]
})
export class ScoresModule {}
