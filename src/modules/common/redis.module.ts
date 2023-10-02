// src/redis-cache/redis-cache.module.ts
import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';

@Module({
    imports: [
        CacheModule.registerAsync({
            useFactory: async () => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                const store = await redisStore({
                    socket: {
                        host: process.env.REDIS_HOST || '127.0.0.1',
                        port: parseInt(process.env.REDIS_PORT, 10) || 6379
                    },
                    password: process.env.REDIS_PASSWORD,
                    ttl: parseInt(process.env.REDIS_TTL, 10) || 60 * 30 // Seconds X Mins (change mins only)
                });

                return {
                    store: store as unknown as CacheStore,
                    ttl: parseInt(process.env.REDIS_TTL, 10) || 60 * 30 // Seconds X Mins (change mins only)
                };
            }
        })
    ],
    exports: [CacheModule]
})
export class RedisCacheModule {}
