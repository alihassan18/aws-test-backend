import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { VerificationResolver } from './verification.resolver';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [VerificationResolver, VerificationService],
    exports: [VerificationService]
})
export class VerificationModule {}
