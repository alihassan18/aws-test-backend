// // publisher.service.ts
// import { Injectable } from '@nestjs/common';
// import { RedisService } from 'nestjs-ioredis';

// @Injectable()
// export class PublisherService {
//     constructor(private readonly redisService: RedisService) {}

//     async publishMessage(message: string, channel: string) {
//         this.redisService.getClient().publish(channel, message);
//     }
// }
