import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { EventsArbitrumGateway } from './events.arbitrum.gateway';
import { NotificationService } from '../notifications/notification.service';
import { EmailService } from '../shared/services/email.service';
import { UsersService } from '../users/users.service';
import { VerificationService } from '../verification/verification.service';
import { AppGateway } from 'src/app.gateway';
import { HashtagsService } from '../feeds/hashtags.service';
import { ScoresService } from '../scores/scores.service';
import { CollectionsService } from '../collections/collections.service';
import { NftsService } from '../nfts/nfts.service';
import { ReservoirService } from '../shared/services/reservoir.service';
import { RedisPubSubService } from '../redis-pubsub/redis-pubsub.service';
import { HttpModule } from '@nestjs/axios';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
// import { EventsEthGateway } from './events.eth.gateway';
// import { EventsBscGateway } from './events.bsc.gateway';
// import { EventsPolygonGateway } from './events.polygon.gateway';
// import { EventsAvalancheGateway } from './events.avalanche.gateway';

@Module({
    imports: [CommonModule, HttpModule],
    providers: [
        EventsArbitrumGateway,
        NotificationService,
        EmailService,
        UsersService,
        VerificationService,
        AppGateway,
        HashtagsService,
        ScoresService,
        CollectionsService,
        NftsService,
        ReservoirService,
        RedisPubSubService,
        sharedEmitterProvider
        // EventsEthGateway,
        // EventsBscGateway,
        // EventsPolygonGateway
        // EventsAvalancheGateway
    ]
})
export class EventsModule {}
