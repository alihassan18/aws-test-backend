import { Test, TestingModule } from '@nestjs/testing';
import { StakingCollectionResolver } from './categories.resolver';
import { StakingCollectionService } from './categories.service';

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
