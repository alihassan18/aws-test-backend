import { Test, TestingModule } from '@nestjs/testing';
import { InvitationCodesService } from './invitation_codes.service';

describe('InvitationCodesService', () => {
    let service: InvitationCodesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [InvitationCodesService]
        }).compile();

        service = module.get<InvitationCodesService>(InvitationCodesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
