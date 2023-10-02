import { Test, TestingModule } from '@nestjs/testing';
import { ReferralVideoService } from './referral-video.service';

describe('ReferralVideoService', () => {
    let service: ReferralVideoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ReferralVideoService]
        }).compile();

        service = module.get<ReferralVideoService>(ReferralVideoService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
