import { Test, TestingModule } from '@nestjs/testing';
import { RwBuildingsResolver } from './rw_buildings.resolver';
import { RwBuildingsService } from './rw_buildings.service';

describe('RwBuildingsResolver', () => {
    let resolver: RwBuildingsResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwBuildingsResolver, RwBuildingsService]
        }).compile();

        resolver = module.get<RwBuildingsResolver>(RwBuildingsResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
