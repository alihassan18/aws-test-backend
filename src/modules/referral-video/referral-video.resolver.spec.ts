import { Test, TestingModule } from '@nestjs/testing';
import { ReferralVideoResolver } from './referral-video.resolver';
import { ReferralVideoService } from './referral-video.service';

describe('ReferralVideoResolver', () => {
    let resolver: ReferralVideoResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ReferralVideoResolver, ReferralVideoService]
        }).compile();

        resolver = module.get<ReferralVideoResolver>(ReferralVideoResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
