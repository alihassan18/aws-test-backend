import { Test, TestingModule } from '@nestjs/testing';
import { BidsResolver } from './history.resolver';
import { BidsService } from './history.service';

describe('BidsResolver', () => {
    let resolver: BidsResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BidsResolver, BidsService]
        }).compile();

        resolver = module.get<BidsResolver>(BidsResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
