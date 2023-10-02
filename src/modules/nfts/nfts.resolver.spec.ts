import { Test, TestingModule } from '@nestjs/testing';
import { NftsResolver } from './nfts.resolver';
import { NftsService } from './nfts.service';

describe('NftsResolver', () => {
    let resolver: NftsResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [NftsResolver, NftsService]
        }).compile();

        resolver = module.get<NftsResolver>(NftsResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
