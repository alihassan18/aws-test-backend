/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

@Injectable()
export class RedisPubSubService {
    private readonly redisPub: Redis.Redis;
    private readonly redisSub: Redis.Redis;

    constructor() {
        // Replace these values with your actual Redis server configuration
        const redisOptions: Redis.RedisOptions = {
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: parseInt(process.env.REDIS_PORT, 10) || 6379,
            password: process.env.REDIS_PASSWORD
            // ttl: parseInt(process.env.REDIS_TTL, 10) || 300 // 5 minutes
        };

        // Use a type assertion to inform TypeScript about the actual type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.redisPub = new (Redis as any)(redisOptions);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.redisSub = new (Redis as any)(redisOptions);
    }

    publish(channel: string, message: any): void {
        this.redisPub.publish(channel, JSON.stringify(message));
    }

    subscribe(channel: string, callback: (message: any) => void): void {
        this.redisSub.subscribe(channel, (err) => {
            if (!err) {
                this.redisSub.on('message', (ch, message) => {
                    if (ch === channel) {
                        callback(JSON.parse(message));
                    }
                });
            }
        });
    }
}
