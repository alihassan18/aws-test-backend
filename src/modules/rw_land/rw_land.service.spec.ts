import { Test, TestingModule } from '@nestjs/testing';
import { RwLandService } from './rw_land.service';

describe('RwLandService', () => {
    let service: RwLandService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwLandService]
        }).compile();

        service = module.get<RwLandService>(RwLandService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
