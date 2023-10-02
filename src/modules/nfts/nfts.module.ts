import { Module } from '@nestjs/common';
import { NftsService } from './nfts.service';
import { NftsResolver } from './nfts.resolver';
import { CommonModule } from '../common/common.module';
import { ReservoirService } from '../shared/services/reservoir.service';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';

@Module({
    imports: [CommonModule],
    providers: [
        NftsResolver,
        NftsService,
        ReservoirService,
        sharedEmitterProvider
    ]
})
export class NftsModule {}
