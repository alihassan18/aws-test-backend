import { Test, TestingModule } from '@nestjs/testing';
import { MetaverseResolver } from './metaverse.resolver';
import { MetaverseService } from './metaverse.service';

describe('MetaverseResolver', () => {
    let resolver: MetaverseResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MetaverseResolver, MetaverseService]
        }).compile();

        resolver = module.get<MetaverseResolver>(MetaverseResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
