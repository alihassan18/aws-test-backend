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

import { Wallet, WalletSchema } from '../users/entities/wallet.entity';
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
import { Utility, UtilitySchema } from '../utilities/entities/utilities.entity';
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
import {
    IPAddress,
    IPAddressSchema
} from '../ip-address/entities/ip-address.entity';

import {
    HiddenTokens,
    HiddenTokensSchema
} from '../nfts/entities/nft.hidden.entity';
import {
    RecentSearch,
    RecentSearchSchema
} from '../recent_searches/entities/recent_search.entity';
import {
    Activity,
    ActivitySchema
} from '../activities/entities/activities.entity';
import { Sales, SalesSchema } from '../sales/entities/sales.entity';
import {
    WithdrawRequest,
    WithdrawRequestSchema
} from '../referral/entities/withdraw.requests.entity';

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
    { name: Wallet.name, schema: WalletSchema },
    { name: Chat.name, schema: ChatSchema },
    { name: ChatNotification.name, schema: ChatNotificationSchema },
    { name: Score.name, schema: ScoreSchema },
    { name: StakingCollection.name, schema: StakingCollectionSchema },
    { name: ReferralVideo.name, schema: ReferralVideoSchema },
    { name: Category.name, schema: CategorySchema },
    { name: Utility.name, schema: UtilitySchema },
    { name: TradeDistribution.name, schema: TradeDistributionSchema },
    { name: Distributions.name, schema: DistributionSchema },
    { name: Listing.name, schema: ListingSchema },
    { name: Bid.name, schema: BidSchema },
    { name: History.name, schema: HistorySchema },
    { name: Nft.name, schema: NftSchema },
    { name: IPAddress.name, schema: IPAddressSchema },
    { name: HiddenTokens.name, schema: HiddenTokensSchema },
    { name: Activity.name, schema: ActivitySchema },
    { name: Sales.name, schema: SalesSchema },
    { name: WithdrawRequest.name, schema: WithdrawRequestSchema },
    { name: RecentSearch.name, schema: RecentSearchSchema }
    // { name: Admin.name, schema: AdminSchema },
];
@Module({
    imports: [MongooseModule.forFeature(models)],
    exports: [MongooseModule.forFeature(models)]
})
export class DatabaseModule {}
