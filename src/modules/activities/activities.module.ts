import { Module } from '@nestjs/common';
import { ActivityService } from './activities.service';
import { ActivityResolver } from './activities.resolver';
import { CommonModule } from '../common/common.module';
import { PublicFeedsGateway } from '../gateways/public/public-feeds.gateway';
import { UsersService } from '../users/users.service';
import { FeedsService } from '../feeds/feeds.service';
import { PostService } from '../feeds/posts.service';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { AppGateway } from 'src/app.gateway';
import { HashtagsService } from '../feeds/hashtags.service';
import { ScoresService } from '../scores/scores.service';
import { CollectionsService } from '../collections/collections.service';
import { NftsService } from '../nfts/nfts.service';
import { NotificationService } from '../notifications/notification.service';
import { LinkedinService } from '../social/linkedin.service';
import { ReservoirService } from '../shared/services/reservoir.service';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { HttpModule } from '@nestjs/axios';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';

@Module({
    imports: [CommonModule, HttpModule],
    providers: [
        ActivityResolver,
        ActivityService,
        PublicFeedsGateway,
        UsersService,
        FeedsService,
        PostService,
        VerificationService,
        EmailService,
        AppGateway,
        HashtagsService,
        ScoresService,
        CollectionsService,
        NftsService,
        NotificationService,
        LinkedinService,
        ReservoirService,
        RedisPubSubService,
        sharedEmitterProvider
    ]
})
export class ActivityModule {}
