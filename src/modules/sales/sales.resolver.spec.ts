import { Test, TestingModule } from '@nestjs/testing';
import { SalesResolver } from './sales.resolver';
import { SalesService } from './sales.service';

describe('SalesResolver', () => {
    let resolver: SalesResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SalesResolver, SalesService]
        }).compile();

        resolver = module.get<SalesResolver>(SalesResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
