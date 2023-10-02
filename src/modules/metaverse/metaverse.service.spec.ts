import { Test, TestingModule } from '@nestjs/testing';
import { MetaverseService } from './metaverse.service';

describe('MetaverseService', () => {
    let service: MetaverseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MetaverseService]
        }).compile();

        service = module.get<MetaverseService>(MetaverseService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
