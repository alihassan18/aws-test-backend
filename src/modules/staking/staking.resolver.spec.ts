import { Test, TestingModule } from '@nestjs/testing';
import { StakingCollectionResolver } from './staking.resolver';
import { StakingCollectionService } from './staking.service';

describe('StakingCollectionResolver', () => {
    let resolver: StakingCollectionResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [StakingCollectionResolver, StakingCollectionService]
        }).compile();

        resolver = module.get<StakingCollectionResolver>(
            StakingCollectionResolver
        );
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
