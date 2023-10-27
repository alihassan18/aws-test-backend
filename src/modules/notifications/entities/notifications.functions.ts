import { NotificationType } from '../notifications.enum';
import { Notification } from '../entities/notification.entity';

export const generateOnesignalMessage = (notification: Notification) => {
    switch (notification.type) {
        case NotificationType.REPOST:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} Reposted your post`;
        case NotificationType.VOTE:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} Voted on your post`;
        case NotificationType.MENTIONED:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} Mentioned you in a post`;
        case NotificationType.COMMENT:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} Commented on your post`;
        case NotificationType.REACTION:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} Reacted on your post`;
        case NotificationType.Like:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} Liked your post`;
        case NotificationType.Like_COMMENT:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} Reacted your comment`;
        case NotificationType.COMMENT_REPLY:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} Replied on your comment`;
        case NotificationType.Hashtag:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} added new post in hastag`;
        case NotificationType.STAGE:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} is live now`;
        case NotificationType.FOLLOW:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} Started following you`;

        // followers notification

        case NotificationType.FOLLOWER_POST:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} Created a post`;
        case NotificationType.FOLLOWER_MINT:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} Mint an NFT Post`;
        case NotificationType.FOLLOWER_COMMENT:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} Added a comment`;
        case NotificationType.FOLLOWER_REPOST:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return ` ${notification.from.userName} your follower has reposted`;
        case NotificationType.FOLLOWER_CREATE_COLLECTION:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} your follower has created a collection`;

        // s3 notification
        case NotificationType.BIDDING:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} make an offer on your NFT`;
        case NotificationType.SOLD:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} sold your NFT`;
        case NotificationType.LISTING:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} your follower list an NFT`;
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
