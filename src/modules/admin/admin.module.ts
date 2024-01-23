import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { AdminGuard } from './admin.guard';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CommonModule } from '../common/common.module';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { AppGateway } from 'src/app.gateway';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';

@Module({
    imports: [CommonModule],
    providers: [
        AdminResolver,
        AdminGuard,
        JwtService,
        UsersService,
        AdminService,
        VerificationService,
        EmailService,
        AppGateway,
        sharedEmitterProvider
    ]
})
export class AdminModule {}
