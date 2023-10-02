import { Test, TestingModule } from '@nestjs/testing';
import { RwBillBoardResolver } from './rw_billboard.resolver';
import { RwBillBoardService } from './rw_billboard.service';

describe('RwGameFlowerResolver', () => {
    let resolver: RwBillBoardResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwBillBoardResolver, RwBillBoardService]
        }).compile();

        resolver = module.get<RwBillBoardResolver>(RwBillBoardResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
