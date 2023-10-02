import { Module, forwardRef } from '@nestjs/common';
import { GraphqlModule } from './graphql.module';
import { MongoModule } from './mongo.module';
import { ConfigModule } from './config.module';
import { RedisCacheModule } from './redis.module';
import { DatabaseModule } from './database.module';
import { GatewaysModule } from '../gateways/gateways.module';

@Module({
    imports: [
        ConfigModule,
        RedisCacheModule,
        GraphqlModule,
        MongoModule,
        DatabaseModule,
        forwardRef(() => GatewaysModule)
    ],
    exports: [
        ConfigModule,
        RedisCacheModule,
        GraphqlModule,
        MongoModule,
        DatabaseModule,
        GatewaysModule
    ]
})
export class CommonModule {}
