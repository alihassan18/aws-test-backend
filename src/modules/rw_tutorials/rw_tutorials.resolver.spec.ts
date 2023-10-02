import { Test, TestingModule } from '@nestjs/testing';
import { RwTutorialsResolver } from './rw_tutorials.resolver';
import { RwTutorialsService } from './rw_tutorials.service';

describe('RwEventsResolver', () => {
    let resolver: RwTutorialsResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwTutorialsResolver, RwTutorialsService]
        }).compile();

        resolver = module.get<RwTutorialsResolver>(RwTutorialsResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
