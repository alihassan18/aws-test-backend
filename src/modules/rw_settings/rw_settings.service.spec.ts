import { Test, TestingModule } from '@nestjs/testing';
import { RwSettingsService } from './rw_settings.service';

describe('RwSettingsService', () => {
    let service: RwSettingsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwSettingsService]
        }).compile();

        service = module.get<RwSettingsService>(RwSettingsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
