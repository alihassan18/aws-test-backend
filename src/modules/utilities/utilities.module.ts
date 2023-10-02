import { Module } from '@nestjs/common';
import { UtilityService } from './utilities.service';
import { UtilityResolver } from './utilities.resolver';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [UtilityResolver, UtilityService]
})
export class UtilityModule {}
