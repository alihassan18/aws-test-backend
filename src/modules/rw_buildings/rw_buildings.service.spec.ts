import { Test, TestingModule } from '@nestjs/testing';
import { RwBuildingsService } from './rw_buildings.service';

describe('RwBuildingsService', () => {
    let service: RwBuildingsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwBuildingsService]
        }).compile();

        service = module.get<RwBuildingsService>(RwBuildingsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
