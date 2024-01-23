import { Module } from '@nestjs/common';
import { GraphqlModule } from './graphql.module';
import { MongoModule } from './mongo.module';
import { ConfigModule } from './config.module';
import { RedisCacheModule } from './redis.module';
import { DatabaseModule } from './database.module';

@Module({
    imports: [
        ConfigModule,
        RedisCacheModule,
        GraphqlModule,
        MongoModule,
        DatabaseModule
    ],
    exports: [
        ConfigModule,
        RedisCacheModule,
        GraphqlModule,
        MongoModule,
        DatabaseModule
    ]
})
export class CommonModule {}
