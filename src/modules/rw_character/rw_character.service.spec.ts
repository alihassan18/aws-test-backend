import { Test, TestingModule } from '@nestjs/testing';
import { RwCharacterService } from './rw_character.service';

describe('RwCharacterService', () => {
    let service: RwCharacterService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwCharacterService]
        }).compile();

        service = module.get<RwCharacterService>(RwCharacterService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
