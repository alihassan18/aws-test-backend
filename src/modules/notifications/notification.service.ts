// notification.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import {
    Notification,
    NotificationDocument
} from './entities/notification.entity';
import {
    NotificationFilterInput,
    NotificationResults
} from './notification.dto';
import { PrivateFeedsGateway } from '../gateways/private/private-feeds.gateway';
import { ENotificationFromType, NotificationType } from './notifications.enum';
import { User } from '../users/entities/user.entity';
import { EmailService } from '../shared/services/email.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationService {
    constructor(
        private emailService: EmailService,
        @InjectModel(Notification.name)
        private readonly notificationModel: Model<NotificationDocument>,
        @InjectModel(User.name) private userModel: Model<User>,
        private privateFeedsGateway: PrivateFeedsGateway,
        private userService: UsersService
    ) {}

    async mainCall(data: Partial<NotificationDocument>): Promise<Notification> {
        const notification = await this.notificationModel.create(data);
        this.sendNotification(notification);
        console.log(notification.type, 'notification created');
        return notification;
    }

    async create(
        data: Partial<NotificationDocument>,
        isSmooth?: boolean
    ): Promise<Notification> {
        if (isSmooth) {
            return this.mainCall(data);
        } else {
            const isSettingEnabled = (
                receiverId: string | Types.ObjectId,
                settingType: string
            ) => {
                return this.userService.isUserSettingEnabled(
                    receiverId,
                    settingType
                );
            };
            switch (data?.type) {
                case NotificationType.MINTING:
                    if (await isSettingEnabled(data?.receiver, 'alerts.mint')) {
                        return this.mainCall(data);
                    }
                    break;

                case NotificationType.BIDDING:
                    if (await isSettingEnabled(data?.receiver, 'alerts.bids')) {
                        return this.mainCall(data);
                    }
                    break;

                case NotificationType.SOLD:
                    if (await isSettingEnabled(data?.receiver, 'alerts.sell')) {
                        return this.mainCall(data);
                    }
                    break;

                case NotificationType.MESSAGE:
                    if (
                        await isSettingEnabled(
                            data?.receiver,
                            'alerts.messenger'
                        )
                    ) {
                        return this.mainCall(data);
                    }
                    break;

                case NotificationType.BOUGHT:
                    if (await isSettingEnabled(data?.receiver, 'alerts.buy')) {
                        return this.mainCall(data);
                    }
                    break;

                case NotificationType.Like:
                case NotificationType.REACTION:
                    if (await isSettingEnabled(data?.receiver, 'alerts.like')) {
                        return this.mainCall(data);
                    }
                    break;

                case NotificationType.COMMENT:
                case NotificationType.COMMENT_REPLY:
                case NotificationType.MENTIONED:
                case NotificationType.FOLLOWER_COMMENT:
                    if (
                        // case NotificationType.FOLLOWER_POST:
                        // case NotificationType.FOLLOWER_MINT:
                        // case NotificationType.FOLLOWER_REPOST:
                        await isSettingEnabled(data?.receiver, 'alerts.comment')
                    ) {
                        return this.mainCall(data);
                    }
                    break;

                case NotificationType.FOLLOW:
                    if (
                        await isSettingEnabled(data?.receiver, 'alerts.follow')
                    ) {
                        return this.mainCall(data);
                    }
                    break;

                default:
                    return this.mainCall(data);
            }
        }
        // return null;
    }

    async sendNotification(data: NotificationDocument) {
        const notification = await this.notificationModel
            .findById(data?._id)
            .populate([
                {
                    path: 'from',
                    select: '_id firstName lastName userName avatar isVerified'
                },
                {
                    path: 'receiver',
                    select: '_id firstName lastName userName avatar isVerified'
                }
            ]);
        this.privateFeedsGateway.emitNotificationToUser(
            data.receiver?.toString(),
            notification
        );
    }

    async findAll(
        query: FilterQuery<NotificationFilterInput>,
        userId: Types.ObjectId,
        limit: number,
        cursor?: string,
        currentPage?: number
    ): Promise<NotificationResults> {
        const filters = {
            receiver: userId,
            ...(query?.mentioned && { type: NotificationType.MENTIONED }),
            ...(query?.system && { type: NotificationType.SYSTEM }),
            ...(query?.personal && {
                $or: [
                    {
                        type: {
                            $nin: [
                                NotificationType.MINTING,
                                NotificationType.BIDDING,
                                NotificationType.LISTING,
                                NotificationType.SOLD,
                                NotificationType.BOUGHT,
                                NotificationType.REMOVE_BID,
                                NotificationType.SYSTEM,
                                NotificationType.FOLLOWER_CREATE_COLLECTION
                            ]
                        }
                    }
                ]
            }),
            ...(query?.nft && {
                $or: [
                    {
                        type: {
                            $in: [
                                NotificationType.MINTING,
                                NotificationType.BIDDING,
                                NotificationType.LISTING,
                                NotificationType.SOLD,
                                NotificationType.BOUGHT,
                                NotificationType.REMOVE_BID,
                                NotificationType.FOLLOWER_CREATE_COLLECTION
                            ]
                        }
                    }
                ]
            })
        };
        if (cursor) {
            filters['_id'] = { $lt: new Types.ObjectId(cursor) };
        }

        const user = await this.userModel.findById(userId).exec();
        const allNotifications = await this.notificationModel.aggregate([
            {
                $match: {
                    from: { $nin: user.blockedUsers },
                    receiver: userId
                }
            },
            { $count: 'allNotificationsCount' }
        ]);

        const mentionedNotifications = await this.notificationModel.aggregate([
            {
                $match: {
                    from: { $nin: user.blockedUsers },
                    receiver: userId,
                    type: NotificationType.MENTIONED
                }
            },
            { $count: 'mentionedNotificationsCount' }
        ]);

        const personalNotifications = await this.notificationModel.aggregate([
            {
                $match: {
                    from: { $nin: user.blockedUsers },
                    receiver: userId,
                    type: {
                        $nin: [
                            NotificationType.MINTING,
                            NotificationType.BIDDING,
                            NotificationType.LISTING,
                            NotificationType.SOLD,
                            NotificationType.BOUGHT,
                            NotificationType.REMOVE_BID,
                            NotificationType.SYSTEM,
                            NotificationType.FOLLOWER_CREATE_COLLECTION
                        ]
                    }
                }
            },
            { $count: 'personalNotificationsCount' }
        ]);

        const systemNotificationCount =
            await this.notificationModel.countDocuments({
                type: NotificationType.SYSTEM,
                receiver: userId
            });

        const nftNotificationsCount =
            await this.notificationModel.countDocuments({
                receiver: userId,
                type: {
                    $in: [
                        NotificationType.MINTING,
                        NotificationType.BIDDING,
                        NotificationType.LISTING,
                        NotificationType.SOLD,
                        NotificationType.BOUGHT,
                        NotificationType.REMOVE_BID,
                        NotificationType.FOLLOWER_CREATE_COLLECTION
                    ]
                }
            });

        const notifications = await this.notificationModel
            .aggregate([
                {
                    $match: {
                        from: { $nin: user.blockedUsers },
                        ...filters
                    }
                },
                { $sort: { _id: -1 } }
            ])
            .exec();

        const hasNextPage = notifications.length > (currentPage ?? 1) * limit;
        const edges = hasNextPage
            ? notifications.slice(0, (currentPage ?? 1) * limit)
            : notifications;
        const endCursor = hasNextPage
            ? edges[edges.length - 1]._id.toString()
            : null;

        return {
            totalRecords: notifications.length,
            recordsFilterd: edges.length,
            cursor: endCursor,
            hasNextPage,
            records: edges,
            allNotifications: allNotifications[0]?.allNotificationsCount || 0,
            mentionedNotifications:
                mentionedNotifications[0]?.mentionedNotificationsCount || 0,
            personalNotificationsCount:
                personalNotifications[0]?.personalNotificationsCount || 0,
            systemNotificatiosCount: systemNotificationCount,
            nftNotificationsCount: nftNotificationsCount
        };
    }

    async findOne(id: string): Promise<Notification> {
        return await this.notificationModel.findById(id).exec();
    }

    async findOneByClause(clause: {
        [key: string]: unknown;
    }): Promise<Notification> {
        return await this.notificationModel.findOne(clause).exec();
    }

    async markAsSeen(
        id: Types.ObjectId,
        userId: Types.ObjectId
    ): Promise<Notification> {
        return await this.notificationModel
            .findOneAndUpdate(
                { _id: id, receiver: userId },
                { seen: true },
                { new: true }
            )
            .exec();
    }

    async markAllAsSeen(userId: Types.ObjectId): Promise<string> {
        await this.notificationModel
            .updateMany({ receiver: userId }, { $set: { seen: true } })
            .exec();
        return 'Marked All as Seen';
    }

    async delete(id: string): Promise<Notification> {
        return await this.notificationModel.findByIdAndDelete(id).exec();
    }

    async getUnSeenCounts(userId: Types.ObjectId): Promise<number> {
        return await this.notificationModel
            .countDocuments({ receiver: userId, seen: false })
            .exec();
    }

    // FOR STAGE NOTIFICATIONS

    async stageInviteToFollowers(
        userId: Types.ObjectId,
        id: string,
        title: string,
        description: string
    ) {
        const user = await this.userModel.findById(userId);

        for (const u of user.followers) {
            await this.create({
                type: NotificationType.STAGE,
                sender: ENotificationFromType.USER,
                from: userId,
                receiver: u,
                stage: id
            });

            const uToSentMail = await this.userModel
                .findById(u)
                .select('email');

            await this.emailService.sendStageInvite(
                `${user.userName}`,
                uToSentMail.email,
                id,
                title,
                description
            );
        }
        return { success: true };
    }

    async stageInviteToUser(
        userId: Types.ObjectId,
        id: string,
        title: string,
        description: string,
        userToInvite: Types.ObjectId
    ) {
        const user = await this.userModel.findById(userId);
        const userTo = await this.userModel.findById(userToInvite);

        await this.create({
            type: NotificationType.STAGE,
            sender: ENotificationFromType.USER,
            from: userId,
            receiver: userToInvite,
            stage: id
        });

        await this.emailService.sendStageInvite(
            `${user.userName}`,
            userTo.email,
            id,
            title,
            description
        );
        return { success: true };
    }
    // ------------------- S3 EVENTS --------------------

    async sendOfferNotification(userId, receiverId, token) {
        const user = await this.userModel.findById(userId).select('userName');
        const receiver = await this.userModel
            .findById(receiverId)
            .select('email');

        await this.create({
            type: NotificationType.BIDDING,
            sender: ENotificationFromType.USER,
            from: userId,
            receiver: receiverId,
            nft: token
        });

        this.emailService.sendBidPlacedEmail(
            receiver.email,
            `${user.userName}`,
            token?.tokenId,
            `${process.env.FRONT_BASE_URL}/collection/arbitrum/${token?.contract}/${token?.tokenId}`
        );

        return;
    }

    async sendBoughtNftNotification(userId, receiverId, token) {
        const user = await this.userModel.findById(userId).select('userName');
        const receiver = await this.userModel
            .findById(receiverId)
            .select('email');

        await this.create({
            type: NotificationType.SOLD,
            sender: ENotificationFromType.USER,
            from: userId,
            receiver: receiverId,
            nft: token
        });

        this.emailService.sendBoughtNftEmail(
            receiver.email,
            `${user.userName}`,
            token?.tokenId
        );

        return;
    }

    // ----------------- USER'S FOLLOWERS NOTIFICATIONS -----------------

    async alertsUsers(userId: Types.ObjectId): Promise<{
        alertsFollowers: Array<string>;
        emailFollowers: Array<string>;
    }> {
        const settingsFields = [
            { field: 'alerts.follow', resultField: '$followers._id' },
            { field: 'email.follow', resultField: '$followers.email' }
        ];

        const aggregatedResults = await Promise.all(
            settingsFields.map(async ({ field, resultField }) => {
                const aggregationResult = await this.userModel.aggregate([
                    {
                        $match: {
                            _id: userId
                        }
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'followers',
                            foreignField: '_id',
                            as: 'followers'
                        }
                    },
                    {
                        $unwind: '$followers'
                    },
                    {
                        $match: {
                            [`followers.settings.${field}`]: true
                        }
                    },
                    {
                        $group: {
                            _id: '$_id',
                            followers: { $push: resultField }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            followers: 1
                        }
                    }
                ]);

                return aggregationResult[0]?.followers || [];
            })
        );
        const [alertsFollowers, emailFollowers] = aggregatedResults;
        return { alertsFollowers, emailFollowers };
    }

    async alertFollowers4Post(
        userId: Types.ObjectId,
        username: string,
        postId: Types.ObjectId,
        text: string
    ) {
        const { alertsFollowers, emailFollowers } = await this.alertsUsers(
            userId
        );

        if (emailFollowers?.length > 0) {
            await this.emailService.sendCreateNewPost_follower(
                emailFollowers,
                username,
                text,
                `${process.env.FRONT_BASE_URL}/feeds/${postId}`
            );
        }

        for (const u of alertsFollowers) {
            await this.create(
                {
                    type: NotificationType.FOLLOWER_POST,
                    sender: ENotificationFromType.USER,
                    from: userId,
                    receiver: new Types.ObjectId(u),
                    post: postId
                },
                true
            );
        }
        return;
    }

    async alertFollowers4Comment(
        userId: Types.ObjectId,
        username: string,
        postId: Types.ObjectId,
        text: string
    ) {
        const { alertsFollowers, emailFollowers } = await this.alertsUsers(
            userId
        );

        if (emailFollowers?.length > 0) {
            await this.emailService.sendCreateNewComment_follower(
                emailFollowers,
                username,
                text,
                `${process.env.FRONT_BASE_URL}/feeds/${postId}`
            );
        }

        for (const u of alertsFollowers) {
            await this.create(
                {
                    type: NotificationType.FOLLOWER_COMMENT,
                    sender: ENotificationFromType.USER,
                    from: userId,
                    receiver: new Types.ObjectId(u),
                    post: postId
                },
                true
            );
        }
        return;
    }

    async alertFollowers4Repost(
        userId: Types.ObjectId,
        username: string,
        postId: Types.ObjectId,
        text: string,
        excludeEmails: Array<string>,
        excludeIds: Array<string>
    ) {
        const { alertsFollowers: a_followers, emailFollowers: e_followers } =
            await this.alertsUsers(userId);

        const emailFollowers =
            e_followers?.filter((item) => !excludeEmails?.includes(item)) || [];

        const alertsFollowers =
            a_followers?.filter((item) => !excludeIds?.includes(item)) || [];

        if (emailFollowers?.length > 0) {
            await this.emailService.sendCreateNewRepost_follower(
                emailFollowers,
                username,
                text,
                `${process.env.FRONT_BASE_URL}/feeds/${postId}`
            );
        }

        for (const u of alertsFollowers) {
            await this.create(
                {
                    type: NotificationType.FOLLOWER_REPOST,
                    sender: ENotificationFromType.USER,
                    from: userId,
                    receiver: new Types.ObjectId(u),
                    post: postId
                },
                true
            );
        }
        return;
    }

    async alertFollowers4Mintpost(
        userId: Types.ObjectId,
        username: string,
        tokenId: string,
        tokenName: string,
        postId: Types.ObjectId,
        picture: string
    ) {
        const { alertsFollowers, emailFollowers } = await this.alertsUsers(
            userId
        );

        if (emailFollowers?.length > 0) {
            await this.emailService.sendCreateNewMintPost_follower(
                emailFollowers,
                username,
                tokenId,
                tokenName,
                `${process.env.FRONT_BASE_URL}/feeds/${postId}`,
                picture
            );
        }

        for (const u of alertsFollowers) {
            await this.create(
                {
                    type: NotificationType.FOLLOWER_MINT,
                    sender: ENotificationFromType.USER,
                    from: userId,
                    receiver: new Types.ObjectId(u),
                    post: postId
                },
                true
            );
        }
        return;
    }

    async alertFollowers4CCollection(
        userId: Types.ObjectId,
        username: string,
        chain: string,
        contract: string,
        image: string,
        supply: string,
        collectionId: string
    ) {
        const { alertsFollowers, emailFollowers } = await this.alertsUsers(
            userId
        );

        if (emailFollowers?.length > 0) {
            await this.emailService.sendCreateNewCCollection_follower(
                emailFollowers,
                username,
                chain,
                contract,
                image,
                supply
            );
        }

        for (const u of alertsFollowers) {
            await this.create(
                {
                    type: NotificationType.FOLLOWER_CREATE_COLLECTION,
                    sender: ENotificationFromType.USER,
                    from: userId,
                    receiver: new Types.ObjectId(u),
                    _collection: new Types.ObjectId(collectionId)
                },
                true
            );
        }
        return;
    }

    async alertFollowers4List(userId: Types.ObjectId, token) {
        const user = await this.userModel.findById(userId).select('userName');

        const { alertsFollowers, emailFollowers } = await this.alertsUsers(
            userId
        );

        if (emailFollowers?.length > 0) {
            await this.emailService.sendListNFT_follower(
                emailFollowers,
                user.userName,
                token.tokenId,
                `${process.env.FRONT_BASE_URL}/collection/arbitrum/${token?.contract}/${token?.tokenId}`,
                token.image,
                token.name
            );
        }

        for (const u of alertsFollowers) {
            await this.create(
                {
                    type: NotificationType.LISTING,
                    sender: ENotificationFromType.USER,
                    from: userId,
                    receiver: new Types.ObjectId(u),
                    nft: token
                },
                true
            );
        }
        return;
    }
}
