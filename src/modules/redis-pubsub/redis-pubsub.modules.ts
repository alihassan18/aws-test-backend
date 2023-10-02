import { Module, forwardRef } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { MySubscriberService } from './subscriber';
import { RedisPubSubService } from './redis-pubsub.service';

@Module({
    imports: [forwardRef(() => CommonModule)],
    providers: [MySubscriberService, RedisPubSubService],
    exports: [MySubscriberService, RedisPubSubService]
})
export class PubsubModule {}
