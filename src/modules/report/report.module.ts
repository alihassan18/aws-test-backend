import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportResolver } from './report.resolver';
import { CommonModule } from '../common/common.module';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { AppGateway } from 'src/app.gateway';
import { HashtagsService } from '../feeds/hashtags.service';
import { PublicUserGateway } from '../gateways/public/public-user.gateway';
import { ScoresService } from '../scores/scores.service';
import { ReferralVideoService } from '../referral-video/referral-video.service';
import { PostService } from '../feeds/posts.service';
import { FeedsService } from '../feeds/feeds.service';
import { LinkedinService } from '../social/linkedin.service';
import { NotificationService } from '../notifications/notification.service';
import { HttpModule } from '@nestjs/axios';
import { CollectionsService } from '../collections/collections.service';
import { ReservoirService } from '../shared/services/reservoir.service';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { LandmapService } from '../landmap/landmap.service';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { NftsService } from '../nfts/nfts.service';

@Module({
    imports: [CommonModule, HttpModule],
    providers: [
        RedisPubSubService,
        PublicUserGateway,
        ReportResolver,
        ReportService,
        JwtService,
        UsersService,
        VerificationService,
        EmailService,
        AppGateway,
        HashtagsService,
        ScoresService,
        ReferralVideoService,
        PostService,
        FeedsService,
        LinkedinService,
        NotificationService,
        CollectionsService,
        ReservoirService,
        sharedEmitterProvider,
        LandmapService,
        NftsService
    ],
    exports: [ReportService]
})
export class ReportModule {}
