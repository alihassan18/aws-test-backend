import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LinkedinService } from './linkedin.service';

@Module({
    imports: [HttpModule],
    providers: [LinkedinService],
    exports: [LinkedinService]
})
export class SocialModule {}
