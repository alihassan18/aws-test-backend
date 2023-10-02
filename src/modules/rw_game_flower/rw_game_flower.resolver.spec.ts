import { Test, TestingModule } from '@nestjs/testing';
import { RwGameFlowerResolver } from './rw_game_flower.resolver';
import { RwGameFlowerService } from './rw_game_flower.service';

describe('RwGameFlowerResolver', () => {
    let resolver: RwGameFlowerResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwGameFlowerResolver, RwGameFlowerService]
        }).compile();

        resolver = module.get<RwGameFlowerResolver>(RwGameFlowerResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
