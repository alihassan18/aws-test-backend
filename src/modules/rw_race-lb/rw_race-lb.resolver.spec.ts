import { Test, TestingModule } from '@nestjs/testing';
import { RwRaceLbResolver } from './rw_race-lb.resolver';
import { RwRaceLbService } from './rw_race-lb.service';

describe('RwRaceLbResolver', () => {
    let resolver: RwRaceLbResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwRaceLbResolver, RwRaceLbService]
        }).compile();

        resolver = module.get<RwRaceLbResolver>(RwRaceLbResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
