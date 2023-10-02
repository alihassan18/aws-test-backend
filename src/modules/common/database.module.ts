// some.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from '../users/entities/user.entity';
import { Post, PostSchema } from '../feeds/entities/post.entity';
import {
    Verification,
    VerificationSchema
} from '../verification/entities/verification.entity';
import { Feed, FeedSchema } from '../feeds/entities/feed.entity';
import { Hashtag, HashtagSchema } from '../feeds/entities/hashtag.entity';
import { CollectionSchema } from '../collections/entities/collection.entity';
import {
    Referral,
    ReferralSchema
} from 'src/modules/referral/entities/referral.entity';
import {
    Notification,
    NotificationSchema
} from '../notifications/entities/notification.entity';
import { Message, MessageSchema } from '../chat/entities/message.entity';
import { Group, GroupSchema } from '../chat/entities/group.entity';
import {
    Reaction,
    ReactionSchema
} from '../reactions/entities/reaction.entity';
import { Report, ReportSchema } from '../report/report.entity';
import {
    TimeSpent,
    TimeSpentSchema
} from '../timespent/entities/timespent.entity';
import { COLLECTIONS, USERS } from 'src/constants/db.collections';
import {
    Invitation,
    InvitationSchema
} from '../chat/entities/invitation.entity';

import { Mrland, MrlandSchema } from '../landmap/entities/mrland.entity';
import { Island, IslandSchema } from '../landmap/entities/island.entity';
import { Wallet, WalletSchema } from '../landmap/entities/wallet.entity';
import { Chat, ChatSchema } from '../chat/entities/chat.entity';
import { Score, ScoreSchema } from '../scores/entities/score.entity';
import {
    ChatNotification,
    ChatNotificationSchema
} from '../chat/entities/chatNotification.entity';
import {
    StakingCollection,
    StakingCollectionSchema
} from '../staking/entities/collection.staking.entity';

import {
    ReferralVideo,
    ReferralVideoSchema
} from '../referral-video/entities/referral-video.entity';
import {
    Category,
    CategorySchema
} from '../categories/entities/categories.entity';
import {
    Metaverse,
    MetaverseSchema
} from '../metaverse/entities/metaverse.entity';
import { Utility, UtilitySchema } from '../utilities/entities/utilities.entity';
import {
    Attribute,
    AttributeSchema
} from '../attributes/entities/attribute.entities';
import {
    TradeDistribution,
    TradeDistributionSchema
} from '../collections/entities/collection.trade.entity';
import {
    DistributionSchema,
    Distributions
} from '../collections/entities/collection.distributions';
import { Listing, ListingSchema } from '../listings/entities/listing.entity';
import { Bid, BidSchema } from '../bids/entities/bid.entity';
import { History, HistorySchema } from '../history/entities/history.entity';
import { Nft, NftSchema } from '../nfts/entities/nft.entity';
import { RwEvent, RwEventSchema } from '../rw_events/entities/rw_event.entity';
import {
    RwTutorials,
    RwTutorialsSchema
} from '../rw_tutorials/entities/rw_tutorials.entity';
import {
    RwBuilding,
    RwBuildingSchema
} from '../rw_buildings/entities/rw_building.entity';
import {
    RwBuildingTypes,
    RwBuildingTypesSchema
} from '../rw_buildings/entities/rw_buildingTypes.entity';
import { RwLand, RwLandSchema } from '../rw_land/entities/rw_land.entity';
import {
    RwSettings,
    RwSettingsSchema
} from '../rw_settings/entities/rw_setting.entity';
import {
    RwUsersMedia,
    RwUsersMediaSchema
} from '../rw_users_media/entities/rw_users_media.entity';
import {
    RwReport,
    RwReportSchema
} from '../rw_report/entities/rw_report.entity';
import {
    RwFightLBSchema,
    RwFightLb
} from '../rw_fight-lb/entities/rw_fight-lb.entity';
import {
    RwRaceLb,
    RwRaceLbSchema
} from '../rw_race-lb/entities/rw_race-lb.entity';
import {
    IPAddress,
    IPAddressSchema
} from '../ip-address/entities/ip-address.entity';
import {
    RwCharacter,
    RwCharacterSchema
} from '../rw_character/entities/rw_character.entity';
import {
    RwBillBoard,
    RwBillBoardSchema
} from '../rw_billboard/entities/rw_billboard.entity';
import {
    RwGameFlower,
    RwGameFlowerSchema
} from '../rw_game_flower/entities/rw_game_flower.entity';
import {
    HiddenTokens,
    HiddenTokensSchema
} from '../nfts/entities/nft.hidden.entity';
import {
    InvitationCode,
    InvitationCodeSchema
} from '../invitation_codes/entities/invitation_code.entity';
import {
    RecentSearch,
    RecentSearchSchema
} from '../recent_searches/entities/recent_search.entity';

const models = [
    { name: USERS, schema: UsersSchema },
    { name: Post.name, schema: PostSchema },
    { name: Verification.name, schema: VerificationSchema },
    { name: Feed.name, schema: FeedSchema },
    { name: Hashtag.name, schema: HashtagSchema },
    { name: COLLECTIONS, schema: CollectionSchema },
    { name: Referral.name, schema: ReferralSchema },
    { name: Notification.name, schema: NotificationSchema },
    { name: Message.name, schema: MessageSchema },
    { name: Group.name, schema: GroupSchema },
    { name: Reaction.name, schema: ReactionSchema },
    { name: Report.name, schema: ReportSchema },
    { name: TimeSpent.name, schema: TimeSpentSchema },
    { name: Invitation.name, schema: InvitationSchema },
    { name: Island.name, schema: IslandSchema },
    { name: Wallet.name, schema: WalletSchema },
    { name: Mrland.name, schema: MrlandSchema },
    { name: Chat.name, schema: ChatSchema },
    { name: ChatNotification.name, schema: ChatNotificationSchema },
    { name: Score.name, schema: ScoreSchema },
    { name: StakingCollection.name, schema: StakingCollectionSchema },
    { name: ReferralVideo.name, schema: ReferralVideoSchema },
    { name: Category.name, schema: CategorySchema },
    { name: Metaverse.name, schema: MetaverseSchema },
    { name: Utility.name, schema: UtilitySchema },
    { name: Attribute.name, schema: AttributeSchema },
    { name: TradeDistribution.name, schema: TradeDistributionSchema },
    { name: Distributions.name, schema: DistributionSchema },
    { name: Listing.name, schema: ListingSchema },
    { name: Bid.name, schema: BidSchema },
    { name: History.name, schema: HistorySchema },
    { name: Nft.name, schema: NftSchema },
    { name: IPAddress.name, schema: IPAddressSchema },
    { name: HiddenTokens.name, schema: HiddenTokensSchema },
    { name: InvitationCode.name, schema: InvitationCodeSchema },

    //  --------------------------------------
    //          RUFFY WORLD COLLECTIONS
    //  --------------------------------------

    { name: RwEvent.name, schema: RwEventSchema },
    { name: RwTutorials.name, schema: RwTutorialsSchema },
    { name: RwCharacter.name, schema: RwCharacterSchema },
    { name: RwBuilding.name, schema: RwBuildingSchema },
    { name: RwBuildingTypes.name, schema: RwBuildingTypesSchema },
    { name: RwLand.name, schema: RwLandSchema },
    { name: RwSettings.name, schema: RwSettingsSchema },
    { name: RwUsersMedia.name, schema: RwUsersMediaSchema },
    { name: RwReport.name, schema: RwReportSchema },
    { name: RwFightLb.name, schema: RwFightLBSchema },
    { name: RwRaceLb.name, schema: RwRaceLbSchema },
    { name: RwBillBoard.name, schema: RwBillBoardSchema },
    { name: RwGameFlower.name, schema: RwGameFlowerSchema },
    { name: RecentSearch.name, schema: RecentSearchSchema }

    // { name: Admin.name, schema: AdminSchema },
];
@Module({
    imports: [MongooseModule.forFeature(models)],
    exports: [MongooseModule.forFeature(models)]
})
export class DatabaseModule {}
