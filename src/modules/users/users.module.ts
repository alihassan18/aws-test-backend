import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { CommonModule } from '../common/common.module';
import { AuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { AppGateway } from 'src/app.gateway';
import { sharedEmitterProvider } from '../shared/providers/shared-emitter.provider';
import { AuthService } from '../auth/auth.service';
import { TwitterStrategy } from '../auth/strategies/twitter.strategy';
import { CloudinaryService } from '../shared/services/cloudinary.service';

@Module({
    imports: [CommonModule],
    providers: [
        UsersResolver,
        UsersService,
        AuthGuard,
        JwtService,
        VerificationService,
        EmailService,
        AppGateway,
        sharedEmitterProvider,
        AuthService,
        TwitterStrategy,
        CloudinaryService
    ],
    exports: [UsersService, AuthGuard, JwtService, AppGateway]
})
export class UsersModule {}
