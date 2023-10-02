import { Test, TestingModule } from '@nestjs/testing';
import { RwReportResolver } from './rw_report.resolver';
import { RwReportService } from './rw_report.service';

describe('RwReportResolver', () => {
    let resolver: RwReportResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwReportResolver, RwReportService]
        }).compile();

        resolver = module.get<RwReportResolver>(RwReportResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
