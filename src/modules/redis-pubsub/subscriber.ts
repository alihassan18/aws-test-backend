import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common';
import { RedisPubSubService } from './redis-pubsub.service';

@Injectable()
export class MySubscriberService implements OnModuleInit {
    constructor(
        @Inject(forwardRef(() => RedisPubSubService))
        private readonly redisPubSubService: RedisPubSubService
    ) {}

    onModuleInit() {
        // Subscribe to the channel 'my-channel'
        this.redisPubSubService.subscribe('my-channel', (message) => {
            console.log('Received message from Project A:', message);
            // Handle the incoming message as needed
        });
    }
}
