import { NotificationType } from '../notifications.enum';
import { Notification } from '../entities/notification.entity';

export const generateOnesignalMessage = (notification: Notification) => {
    switch (notification.type) {
        case NotificationType.REPOST:
            return 'Reposted your post';
        case NotificationType.VOTE:
            return 'Voted on your post';
        case NotificationType.MENTIONED:
            return 'Mentioned you in a post';
        case NotificationType.COMMENT:
            return 'Commented on your post';
        case NotificationType.REACTION:
            return 'Reacted on your post';
        case NotificationType.Like:
            return 'Liked your post';
        case NotificationType.Like_COMMENT:
            return 'Reacted your comment';
        case NotificationType.COMMENT_REPLY:
            return 'Replied on your comment';
        case NotificationType.Hashtag:
            return 'Someone added new post in hastag';
        case NotificationType.STAGE:
            return 'is live now';
        case NotificationType.FOLLOW:
            return 'Started following you';

        // followers notification

        case NotificationType.FOLLOWER_POST:
            return 'Created a post';
        case NotificationType.FOLLOWER_MINT:
            return 'Mint an NFT Post';
        case NotificationType.FOLLOWER_COMMENT:
            return 'Added a comment';
        case NotificationType.FOLLOWER_REPOST:
            return 'your follower has reposted';
        case NotificationType.FOLLOWER_CREATE_COLLECTION:
            return 'your follower has created a collection';

        // s3 notification
        case NotificationType.BIDDING:
            return 'make an offer on your NFT';
        case NotificationType.SOLD:
            return 'sold your NFT';
        case NotificationType.LISTING:
            return 'your follower list an NFT';
        case NotificationType.SYSTEM:
            return notification.message;
        default:
            break;
    }
};

export const generateOnesignalURL = (notification: Notification) => {
    switch (notification?.type) {
        case NotificationType.REPOST:
        case NotificationType.VOTE:
        case NotificationType.MENTIONED:
        case NotificationType.COMMENT:
        case NotificationType.REACTION:
        case NotificationType.Like:
        case NotificationType.Like_COMMENT:
        case NotificationType.Hashtag:
        case NotificationType.FOLLOWER_POST:
        case NotificationType.FOLLOWER_COMMENT:
        case NotificationType.FOLLOWER_REPOST:
        case NotificationType.FOLLOWER_MINT:
            return `${process.env.FRONT_BASE_URL}/feeds/${notification?.post?._id}`;

        case NotificationType.STAGE:
            return `${process.env.FRONT_BASE_URL}/?stage=${notification?.stage}`;
        case NotificationType.FOLLOW:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${process.env.FRONT_BASE_URL}/@${notification.from?.userName}`;
        case NotificationType.FOLLOWER_CREATE_COLLECTION:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${process.env.FRONT_BASE_URL}/collection/${notification._collection.chain}/${notification._collection.contract}`;

        // s3
        case NotificationType.BIDDING:
        case NotificationType.SOLD:
        case NotificationType.LISTING:
            return `${process.env.FRONT_BASE_URL}/collection/arbitrum/${notification?.nft?.contract}/${notification?.nft?.tokenId}`;

        default:
            break;
    }
};
