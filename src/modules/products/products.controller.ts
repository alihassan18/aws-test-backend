// some.controller.ts
import { Controller, Get } from '@nestjs/common';
import { FileProcessingService } from '../shared/services/file-processing.service';

@Controller('setup')
export class ProductController {
    constructor(private readonly fileProcessing: FileProcessingService) {}

    @Get()
    setup() {
        return this.fileProcessing.setup();
    }
}
