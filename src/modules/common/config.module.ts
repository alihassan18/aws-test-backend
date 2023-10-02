import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import cloudinaryConfig from '../../common/cloudinary.config';

@Module({
    imports: [
        NestConfigModule.forRoot({
            envFilePath: ['.env'],
            isGlobal: true,
            load: [cloudinaryConfig]
        })
    ]
})
export class ConfigModule {}
