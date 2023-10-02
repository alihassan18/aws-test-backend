import { Test, TestingModule } from '@nestjs/testing';
import { RwSettingsResolver } from './rw_settings.resolver';
import { RwSettingsService } from './rw_settings.service';

describe('RwSettingsResolver', () => {
    let resolver: RwSettingsResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwSettingsResolver, RwSettingsService]
        }).compile();

        resolver = module.get<RwSettingsResolver>(RwSettingsResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
