import { Test, TestingModule } from '@nestjs/testing';
import { RwFightLbService } from './rw_fight-lb.service';

describe('RwFightLbService', () => {
    let service: RwFightLbService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwFightLbService]
        }).compile();

        service = module.get<RwFightLbService>(RwFightLbService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
