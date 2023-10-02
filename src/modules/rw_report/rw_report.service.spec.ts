import { Test, TestingModule } from '@nestjs/testing';
import { RwReportService } from './rw_report.service';

describe('RwReportService', () => {
    let service: RwReportService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwReportService]
        }).compile();

        service = module.get<RwReportService>(RwReportService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
