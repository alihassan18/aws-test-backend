import { Test, TestingModule } from '@nestjs/testing';
import { RecentSearchesResolver } from './recent_searches.resolver';
import { RecentSearchesService } from './recent_searches.service';

describe('RecentSearchesResolver', () => {
    let resolver: RecentSearchesResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RecentSearchesResolver, RecentSearchesService]
        }).compile();

        resolver = module.get<RecentSearchesResolver>(RecentSearchesResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
