import { Test, TestingModule } from '@nestjs/testing';
import { RwRaceLbService } from './rw_race-lb.service';

describe('RwRaceLbService', () => {
    let service: RwRaceLbService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwRaceLbService]
        }).compile();

        service = module.get<RwRaceLbService>(RwRaceLbService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
