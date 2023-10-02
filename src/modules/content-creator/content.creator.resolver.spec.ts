import { Test, TestingModule } from '@nestjs/testing';
import { CollectionsResolver } from './content.creator.resolver';
import { CollectionsService } from './content.creator.service';

describe('CollectionsResolver', () => {
    let resolver: CollectionsResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CollectionsResolver, CollectionsService]
        }).compile();

        resolver = module.get<CollectionsResolver>(CollectionsResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
