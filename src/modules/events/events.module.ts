import { Module } from '@nestjs/common';
import { EventsEthGateway } from './events.eth.gateway';
import { CommonModule } from '../common/common.module';
import { EventsBscGateway } from './events.bsc.gateway';
import { EventsPolygonGateway } from './events.polygon.gateway';
// import { EventsAvalancheGateway } from './events.avalanche.gateway';

@Module({
    imports: [CommonModule],
    providers: [
        EventsEthGateway,
        EventsBscGateway,
        EventsPolygonGateway
        // EventsAvalancheGateway
    ]
})
export class EventsModule {}
