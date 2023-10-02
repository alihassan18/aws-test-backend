import { Test, TestingModule } from '@nestjs/testing';
import { RwGameFlowerService } from './rw_game_flower.service';

describe('RwGameFlowerService', () => {
    let service: RwGameFlowerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwGameFlowerService]
        }).compile();

        service = module.get<RwGameFlowerService>(RwGameFlowerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
