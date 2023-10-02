import { Test, TestingModule } from '@nestjs/testing';
import { TimeSpentService } from './timespent.service';
import { TimeSpentResolver } from './timespent.resolver';

describe('TimespentResolver', () => {
    let resolver: TimeSpentResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TimeSpentResolver, TimeSpentService]
        }).compile();

        resolver = module.get<TimeSpentResolver>(TimeSpentResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
