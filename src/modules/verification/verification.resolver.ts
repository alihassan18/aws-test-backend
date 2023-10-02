import { Resolver } from '@nestjs/graphql';
import { VerificationService } from './verification.service';
import { Verification } from './entities/verification.entity';

@Resolver(() => Verification)
export class VerificationResolver {
    constructor(private readonly verificationService: VerificationService) {}
}
