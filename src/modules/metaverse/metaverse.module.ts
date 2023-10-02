import { Module } from '@nestjs/common';
import { MetaverseService } from './metaverse.service';
import { MetaverseResolver } from './metaverse.resolver';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [MetaverseResolver, MetaverseService]
})
export class MetaverseModule {}
