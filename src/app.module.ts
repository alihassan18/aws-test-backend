import {
    /*  MiddlewareConsumer, */ Module /* RequestMethod */
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './modules/common/common.module';
import { UsersModule } from './modules/users/users.module';
import { CollectionsModule } from './modules/collections/collections.module';
import { ListingsModule } from './modules/listings/listings.module';
import { NftsModule } from './modules/nfts/nfts.module';
import { BidsModule } from './modules/bids/bids.module';
import { FeedsModule } from './modules/feeds/feeds.module';
import { AuthModule } from './modules/auth/auth.module';
import { VerificationModule } from './modules/verification/verification.module';
import { ReferralModule } from './modules/referral/referral.module';
import { AppGateway } from './app.gateway';
import { NotificationModule } from './modules/notifications/notification.module';
import { ChatModule } from './modules/chat/chat.module';
import { ReactionsModule } from './modules/reactions/reactions.module';
import { ReportModule } from './modules/report/report.module';
import { TimespentModule } from './modules/timespent/timespent.module';
import { sharedEmitterProvider } from './modules/shared/providers/shared-emitter.provider';
import { SocialModule } from './modules/social/social.module';
import { ConfigModule } from '@nestjs/config';
import { LandmapModule } from './modules/landmap/landmap.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ScoresModule } from './modules/scores/scores.module';
import { StakingModule } from './modules/staking/staking.module';
// import { socketAuthMiddleware } from './modules/auth/socket-auth.middleware';
import { ReferralVideoModule } from './modules/referral-video/referral-video.module';
import { CategoryModule } from './modules/categories/categories.module';
import { MetaverseModule } from './modules/metaverse/metaverse.module';
import { UtilityModule } from './modules/utilities/utilities.module';
import { AdminModule } from './modules/admin/admin.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { HistoryModule } from './modules/history/history.module';
import { RwEventsModule } from './modules/rw_events/rw_events.module';
import { RwTutorialModule } from './modules/rw_tutorials/rw_tutorials.module';
import { RwCharacterModule } from './modules/rw_character/rw_character.module';
import { RwBuildingsModule } from './modules/rw_buildings/rw_buildings.module';
import { RwLandModule } from './modules/rw_land/rw_land.module';
import { RwSettingsModule } from './modules/rw_settings/rw_settings.module';
// import { EventsModule } from './modules/events/events.module';
import { RwUsersMediaModule } from './modules/rw_users_media/rw_users_media.module';
// import { ContractEventsModule } from './modules/contract-events/contract-events.module';
import { RwReportModule } from './modules/rw_report/rw_report.module';
import { RwFightLbModule } from './modules/rw_fight-lb/rw_fight-lb.module';
import { RwRaceLbModule } from './modules/rw_race-lb/rw_race-lb.module';
import { IpAddressModule } from './modules/ip-address/ip-address.module';
import { RwBillboardModule } from './modules/rw_billboard/rw_billboard.module';
import { RwGameFlowerModule } from './modules/rw_game_flower/rw_game_flower.module';
import { BullModule } from '@nestjs/bull';
import { InvitationCodesModule } from './modules/invitation_codes/invitation_codes.module';
import { RecentSearchesModule } from './modules/recent_searches/recent_searches.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
            cache: true
        }),
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST || '127.0.0.1',
                port: parseInt(process.env.REDIS_PORT, 10) || 6379,
                password: process.env.REDIS_PASSWORD
            }
        }),
        CommonModule,
        UsersModule,
        CollectionsModule,
        AuthModule,
        ListingsModule,
        NftsModule,
        BidsModule,
        FeedsModule,
        VerificationModule,
        ReferralModule,
        NotificationModule,
        ChatModule,
        ReactionsModule,
        ScoresModule,
        ReportModule,
        TimespentModule,
        LandmapModule,
        SocialModule,
        StakingModule,
        ReferralVideoModule,
        CategoryModule,
        MetaverseModule,
        UtilityModule,
        AdminModule,
        HistoryModule,
        RwEventsModule,
        RwTutorialModule,
        RwCharacterModule,
        RwBuildingsModule,
        RwLandModule,
        RwSettingsModule,
        // EventsModule,
        // ContractEventsModule
        RwUsersMediaModule,
        RwReportModule,
        RwFightLbModule,
        RwRaceLbModule,
        IpAddressModule,
        RwBillboardModule,
        RwGameFlowerModule,
        InvitationCodesModule,
        RecentSearchesModule
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
