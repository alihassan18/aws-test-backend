import { Test, TestingModule } from '@nestjs/testing';
import { RwEventsService } from './rw_events.service';

describe('RwEventsService', () => {
    let service: RwEventsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwEventsService]
        }).compile();

        service = module.get<RwEventsService>(RwEventsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
