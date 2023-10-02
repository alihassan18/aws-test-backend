import { Test, TestingModule } from '@nestjs/testing';
import { RwLandResolver } from './rw_land.resolver';
import { RwLandService } from './rw_land.service';

describe('RwLandResolver', () => {
    let resolver: RwLandResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwLandResolver, RwLandService]
        }).compile();

        resolver = module.get<RwLandResolver>(RwLandResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
