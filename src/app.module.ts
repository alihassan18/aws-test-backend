import {
    /*  MiddlewareConsumer, */ Module /* RequestMethod */
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './modules/common/common.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { VerificationModule } from './modules/verification/verification.module';
import { AppGateway } from './app.gateway';
import { sharedEmitterProvider } from './modules/shared/providers/shared-emitter.provider';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { AdminModule } from './modules/admin/admin.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ProductsModule } from './modules/products/products.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
console.log(join(__dirname, '..', 'public'));

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public')
        }),
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
            cache: true
        }),
        CommonModule,
        UsersModule,
        AuthModule,
        VerificationModule,
        AdminModule,
        ProductsModule,
        ReviewsModule
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter
        },
        AppGateway,
        AppService,
        sharedEmitterProvider
    ]
})
export class AppModule {
    // configure(consumer: MiddlewareConsumer) {
    //     consumer
    //         .apply(socketAuthMiddleware)
    //         .forRoutes({ path: '*', method: RequestMethod.ALL });
    // }
}
