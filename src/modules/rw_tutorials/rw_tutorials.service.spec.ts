import { Test, TestingModule } from '@nestjs/testing';
import { RwTutorialsService } from './rw_tutorials.service';

describe('RwEventsService', () => {
    let service: RwTutorialsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwTutorialsService]
        }).compile();

        service = module.get<RwTutorialsService>(RwTutorialsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
