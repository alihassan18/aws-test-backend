import { Test, TestingModule } from '@nestjs/testing';
import { RecentSearchesService } from './recent_searches.service';

describe('RecentSearchesService', () => {
    let service: RecentSearchesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RecentSearchesService]
        }).compile();

        service = module.get<RecentSearchesService>(RecentSearchesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
