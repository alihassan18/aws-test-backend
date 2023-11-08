import { Module } from '@nestjs/common';
import { ZackService } from './zack.service';
import { HttpService } from '@nestjs/axios'; // Import HttpService

@Module({
    providers: [ZackService, HttpService],
    exports: [ZackService]
})
export class ZackModule {}
