import { Test, TestingModule } from '@nestjs/testing';
import { UtilityService } from './utilities.service';

describe('UtilityService', () => {
    let service: UtilityService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UtilityService]
        }).compile();

        service = module.get<UtilityService>(UtilityService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
