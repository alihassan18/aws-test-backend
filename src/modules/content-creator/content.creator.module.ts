import { Module } from '@nestjs/common';
import { ContentCreatorService } from './content.creator.service';
import { ContentCreatorResolver } from './content.creator.resolver';
import { CommonModule } from '../common/common.module';
import { UsersService } from '../users/users.service';
import { VerificationService } from '../verification/verification.service';
import { EmailService } from '../shared/services/email.service';
import { AppGateway } from 'src/app.gateway';
import { HashtagsService } from '../feeds/hashtags.service';
import { FeedsService } from '../feeds/feeds.service';
import { ScoresService } from '../scores/scores.service';

@Module({
    imports: [CommonModule],
    providers: [
        ContentCreatorResolver,
        ContentCreatorService,
        UsersService,
        VerificationService,
        EmailService,
        AppGateway,
        HashtagsService,
        FeedsService,
        ScoresService
    ],
    exports: [ContentCreatorService]
})
export class ContentCreatorModule {}
