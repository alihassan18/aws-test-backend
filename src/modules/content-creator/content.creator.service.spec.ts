import { Test, TestingModule } from '@nestjs/testing';
import { ContentCreatorService } from './content.creator.service';

describe('ContentCreatorService', () => {
    let service: ContentCreatorService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ContentCreatorService]
        }).compile();

        service = module.get<ContentCreatorService>(ContentCreatorService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
