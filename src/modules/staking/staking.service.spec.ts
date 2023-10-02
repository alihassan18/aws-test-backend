import { Test, TestingModule } from '@nestjs/testing';
import { StakingCollectionService } from './staking.service';

describe('StakingCollectionService', () => {
    let service: StakingCollectionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [StakingCollectionService]
        }).compile();

        service = module.get<StakingCollectionService>(
            StakingCollectionService
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
