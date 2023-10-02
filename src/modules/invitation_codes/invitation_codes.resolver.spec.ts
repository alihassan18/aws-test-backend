import { Test, TestingModule } from '@nestjs/testing';
import { InvitationCodesResolver } from './invitation_codes.resolver';
import { InvitationCodesService } from './invitation_codes.service';

describe('InvitationCodesResolver', () => {
    let resolver: InvitationCodesResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [InvitationCodesResolver, InvitationCodesService]
        }).compile();

        resolver = module.get<InvitationCodesResolver>(InvitationCodesResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
