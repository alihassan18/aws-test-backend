// src/gateways/gateways.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { PublicFeedsGateway } from './public/public-feeds.gateway';
// import { PublicChatGateway } from './public/public-chat.gateway';
import { PrivateFeedsGateway } from './private/private-feeds.gateway';
import { UsersService } from '../users/users.service';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { AppGateway } from 'src/app.gateway';
import { FeedsService } from '../feeds/feeds.service';
import { CommonModule } from '../common/common.module';
import { JwtService } from '@nestjs/jwt';
import { WSJwtAuthGuard } from '../auth/ws.auth.guard';
import { AuthService } from '../auth/auth.service';
import { ReferralService } from 'src/modules/referral/referral.service';
import { TwitterStrategy } from '../auth/strategies/twitter.strategy';
// import { PublicChatGateway } from './public/public-chat.gateway';
import { ChatService } from '../chat/chat.service';
import { PrivateChatGateway } from './private/private-chat.gateway';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { PublicLandmapGateway } from './public/public-landmap.gateway';
import { HashtagsService } from '../feeds/hashtags.service';
import { PublicUserGateway } from './public/public-user.gateway';
import { PostService } from '../feeds/posts.service';
import { LinkedinService } from '../social/linkedin.service';
import { NotificationService } from '../notifications/notification.service';
import { HttpModule } from '@nestjs/axios';
import { ScoresService } from '../scores/scores.service';
import { ReferralVideoService } from '../referral-video/referral-video.service';
import { CollectionsService } from '../collections/collections.service';
import { ReservoirService } from '../shared/services/reservoir.service';
import { PublicCollectionGateway } from './public/public-collection.gateway';
import { IpAddressService } from '../ip-address/ip-address.service';
// import { PubsubModule } from '../redis-pubsub/redis-pubsub.modules';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { NftsService } from '../nfts/nfts.service';
// import { PrivateChatGateway } from './private/private-chat.gateway';

@Module({
    imports: [
        forwardRef(() => CommonModule),
        HttpModule
        // forwardRef(() => PubsubModule)
    ],
    providers: [
        RedisPubSubService,
        AuthService,
        UsersService,
        FeedsService,
        ChatService,
        VerificationService,
        EmailService,
        PrivateFeedsGateway,
        PublicFeedsGateway,
        PublicUserGateway,
        // PublicChatGateway,
        PublicLandmapGateway,
        PublicCollectionGateway,
        CollectionsService,
        JwtService,
        AuthService,
        WSJwtAuthGuard,
        PrivateChatGateway,
        sharedEmitterProvider,
        AppGateway,
        ReferralService,
        TwitterStrategy,
        HashtagsService,
        PostService,
        LinkedinService,
        NotificationService,
        ScoresService,
        ReferralVideoService,
        CollectionsService,
        ReservoirService,
        IpAddressService,
        NftsService
    ],
    exports: [
        // PublicChatGateway,
        PublicFeedsGateway,
        PrivateChatGateway,
        PrivateFeedsGateway,
        PublicLandmapGateway,
        PublicUserGateway,
        PublicCollectionGateway
    ]
})
export class GatewaysModule {}
