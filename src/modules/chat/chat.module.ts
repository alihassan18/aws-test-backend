import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MessageResolver } from './message.resolver';
import { UsersService } from '../users/users.service';
import { AppGateway } from 'src/app.gateway';
import { JwtService } from '@nestjs/jwt';
import { GroupResolver } from './group.resolver';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { CommonModule } from '../common/common.module';
import { InvitationResolver } from './invitation.resolver';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';
import { ReferralService } from 'src/modules/referral/referral.service';
import { TwitterStrategy } from '../auth/strategies/twitter.strategy';
import { HashtagsService } from '../feeds/hashtags.service';
import { ChatResolver } from './chat.resolver';
import { ScoresService } from '../scores/scores.service';
import { ReferralVideoService } from '../referral-video/referral-video.service';
import { IpAddressService } from '../ip-address/ip-address.service';
import { CollectionsService } from '../collections/collections.service';
import { ReservoirService } from '../shared/services/reservoir.service';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { NftsService } from '../nfts/nfts.service';

@Module({
    imports: [CommonModule],
    providers: [
        HashtagsService,
        AuthService,
        ChatResolver,
        MessageResolver,
        GroupResolver,
        InvitationResolver,
        ChatService,
        UsersService,
        AppGateway,
        JwtService,
        VerificationService,
        EmailService,
        ReferralService,
        AuthGuard,
        TwitterStrategy,
        HashtagsService,
        ScoresService,
        ReferralVideoService,
        IpAddressService,
        CollectionsService,
        ReservoirService,
        RedisPubSubService,
        NftsService,
        sharedEmitterProvider
    ],
    exports: [
        AuthGuard,
        JwtService,
        UsersService,
        AppGateway,
        HashtagsService,
        VerificationService,
        EmailService
    ]
})
export class ChatModule {}
