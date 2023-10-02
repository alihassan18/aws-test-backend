import { Test, TestingModule } from '@nestjs/testing';
import { RwEventsResolver } from './rw_events.resolver';
import { RwEventsService } from './rw_events.service';

describe('RwEventsResolver', () => {
    let resolver: RwEventsResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwEventsResolver, RwEventsService]
        }).compile();

        resolver = module.get<RwEventsResolver>(RwEventsResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
