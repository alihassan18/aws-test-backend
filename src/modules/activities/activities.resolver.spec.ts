import { Test, TestingModule } from '@nestjs/testing';
import { ActivityResolver } from './activities.resolver';
import { ActivityService } from './activities.service';

describe('ActivityResolver', () => {
    let resolver: ActivityResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ActivityResolver, ActivityService]
        }).compile();

        resolver = module.get<ActivityResolver>(ActivityResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
