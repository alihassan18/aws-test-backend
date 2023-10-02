import { Module } from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CategoryResolver } from './categories.resolver';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [CategoryResolver, CategoryService]
})
export class CategoryModule {}
