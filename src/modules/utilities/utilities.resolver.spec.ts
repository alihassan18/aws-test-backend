import { Test, TestingModule } from '@nestjs/testing';
import { UtilityResolver } from './utilities.resolver';
import { UtilityService } from './utilities.service';

describe('UtilityResolver', () => {
    let resolver: UtilityResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UtilityResolver, UtilityService]
        }).compile();

        resolver = module.get<UtilityResolver>(UtilityResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
