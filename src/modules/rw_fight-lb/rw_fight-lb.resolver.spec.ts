import { Test, TestingModule } from '@nestjs/testing';
import { RwFightLbResolver } from './rw_fight-lb.resolver';
import { RwFightLbService } from './rw_fight-lb.service';

describe('RwFightLbResolver', () => {
    let resolver: RwFightLbResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwFightLbResolver, RwFightLbService]
        }).compile();

        resolver = module.get<RwFightLbResolver>(RwFightLbResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
