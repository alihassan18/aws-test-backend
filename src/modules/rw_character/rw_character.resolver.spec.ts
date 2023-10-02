import { Test, TestingModule } from '@nestjs/testing';
import { RwCharacterResolver } from './rw_character.resolver';
import { RwCharacterService } from './rw_character.service';

describe('RwCharacterResolver', () => {
    let resolver: RwCharacterResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwCharacterResolver, RwCharacterService]
        }).compile();

        resolver = module.get<RwCharacterResolver>(RwCharacterResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
