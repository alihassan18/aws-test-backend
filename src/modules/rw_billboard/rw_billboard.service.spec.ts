import { Test, TestingModule } from '@nestjs/testing';
import { RwBillBoardService } from './rw_billboard.service';

describe('RwBillBoardService', () => {
    let service: RwBillBoardService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwBillBoardService]
        }).compile();

        service = module.get<RwBillBoardService>(RwBillBoardService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
