import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { CommonModule } from '../common/common.module';
import { ProductController } from './products.controller';
import { FileProcessingService } from '../shared/services/file-processing.service';

@Module({
    imports: [CommonModule],
    controllers: [ProductController],
    providers: [ProductsResolver, ProductsService, FileProcessingService]
})
export class ProductsModule {}
