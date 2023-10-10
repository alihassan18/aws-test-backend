import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { SocketIOAdapter } from './socket.gateway';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// import { ErrorMiddleware } from './middlewares/error.middleware';
//ignore-typescript

config();
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // // Create and run the microservice
    // app.connectMicroservice<MicroserviceOptions>({
    //     transport: Transport.REDIS,
    //     options: {
    //         host: process.env.REDIS_HOST || '127.0.0.1',
    //         port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    //         password: process.env.REDIS_PASSWORD
    //     }
    // });

    // await app.startAllMicroservices();

    // Register the error middleware
    // app.use(ErrorMiddleware);
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.enableCors({
        origin: '*' // Replace with your client's origin or a specific domain
        // methods: ['GET', 'POST', 'PUT', 'DELETE'],
        // allowedHeaders: ['Content-Type', 'Authorization'],
        // credentials: true
    });
    app.useWebSocketAdapter(new SocketIOAdapter(app));
    app.use(cookieParser());
    app.use(
        session({
            secret: 'your_secret_key',
            resave: false,
            saveUninitialized: false
        })
    );
    // const config = new DocumentBuilder()
    //     .setTitle('Mintstargram V2 API')
    //     .setDescription('The v2 API description')
    //     .setVersion('2.0')
    //     .addTag('Mintstargram-v2')
    //     .build();
    // const document = SwaggerModule.createDocument(app, config);
    app.enableCors();
    // SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT || 3000);
}
bootstrap();
