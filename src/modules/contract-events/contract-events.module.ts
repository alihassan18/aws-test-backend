import { Module } from '@nestjs/common';
import { ContractEventsService } from './contract-events.service';
import { CommonModule } from '../common/common.module';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [CommonModule, HttpModule],
    providers: [ContractEventsService]
})
export class ContractEventsModule {}
