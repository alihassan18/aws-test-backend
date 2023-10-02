import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsResolver } from './bids.resolver';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [BidsResolver, BidsService]
})
export class BidsModule {}
