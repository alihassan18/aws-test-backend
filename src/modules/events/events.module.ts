import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { EventsArbitrumGateway } from './events.arbitrum.gateway';
// import { EventsEthGateway } from './events.eth.gateway';
// import { EventsBscGateway } from './events.bsc.gateway';
// import { EventsPolygonGateway } from './events.polygon.gateway';
// import { EventsAvalancheGateway } from './events.avalanche.gateway';

@Module({
    imports: [CommonModule],
    providers: [
        EventsArbitrumGateway
        // EventsEthGateway,
        // EventsBscGateway,
        // EventsPolygonGateway
        // EventsAvalancheGateway
    ]
})
export class EventsModule {}
