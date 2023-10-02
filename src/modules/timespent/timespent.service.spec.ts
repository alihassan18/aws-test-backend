import { Test, TestingModule } from '@nestjs/testing';
import { TimeSpentService } from './timespent.service';

describe('TimespentService', () => {
    let service: TimeSpentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TimeSpentService]
        }).compile();

        service = module.get<TimeSpentService>(TimeSpentService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
