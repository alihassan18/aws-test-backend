import { Module } from '@nestjs/common';
import { ActivityService } from './activities.service';
import { ActivityResolver } from './activities.resolver';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [ActivityResolver, ActivityService]
})
export class ActivityModule {}
