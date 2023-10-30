import { NotificationType } from '../notifications.enum';
import { Notification } from '../entities/notification.entity';

export const NotificationMessages = {
    [NotificationType.REPOST]: 'has reposted your post',
    // [NotificationType.REPOST_COMMENT]: 'has reposted your comment',
    [NotificationType.VOTE]: 'has voted on your poll',
    [NotificationType.MENTIONED]: 'has mentioned you in the post',
    [NotificationType.COMMENT]: ' has commented on your post',
    [NotificationType.REACTION]: 'has reacted on your post',
    [NotificationType.LIKE]: 'has liked to your post',
    [NotificationType.LIKE_COMMENT]: 'has reacted to your comment',
    [NotificationType.COMMENT_REPLY]: 'has replied on your comment',
    [NotificationType.HASHTAG]: 'someone added new post in hashtag',
    [NotificationType.STAGE]: 'is live. Join now!',
    [NotificationType.FOLLOW]: 'has started following you',
    [NotificationType.FOLLOWER_POST]: 'you followed has created a new post',
    [NotificationType.FOLLOWER_MINT]:
        'you followed has created a new mint post',
    [NotificationType.FOLLOWER_COMMENT]: 'you followed has added a comment',
    [NotificationType.FOLLOWER_REPOST]: 'you followed has reposted',
    [NotificationType.FOLLOWER_CREATE_COLLECTION]:
        'you followed has created a new collection',
    [NotificationType.BIDDING]: 'has make an offer on your NFT',
    [NotificationType.SOLD]: 'has sold your NFT',
    [NotificationType.LISTING]: 'you followed has listed an NFT'
};
export const generateOnesignalMessage = (notification: Notification) => {
    switch (notification.type) {
        case NotificationType.REPOST:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.REPOST]
            }`;
        // case NotificationType.REPOST_COMMENT: //not present in db
        //     return NotificationMessages[NotificationType.REPOST_COMMENT];
        case NotificationType.VOTE:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.VOTE]
            }`;
        case NotificationType.MENTIONED:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.MENTIONED]
            }`;
        case NotificationType.COMMENT:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.COMMENT]
            }`;
        case NotificationType.REACTION:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.REACTION]
            }`;

        case NotificationType.LIKE:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.LIKE]
            }`;
        case NotificationType.LIKE_COMMENT:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.LIKE_COMMENT]
            }`;
        case NotificationType.COMMENT_REPLY:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.COMMENT_REPLY]
            }`;
        case NotificationType.HASHTAG:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.HASHTAG]
            }`;
        case NotificationType.STAGE:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.STAGE]
            }`;
        case NotificationType.FOLLOW:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.FOLLOW]
            }`;

        // followers notification

        case NotificationType.FOLLOWER_POST:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.FOLLOWER_POST]
            }`;
        case NotificationType.FOLLOWER_MINT:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.FOLLOWER_MINT]
            }`;

        case NotificationType.FOLLOWER_COMMENT:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.FOLLOWER_COMMENT]
            }`;

        case NotificationType.FOLLOWER_REPOST:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.FOLLOWER_REPOST]
            }`;

        case NotificationType.FOLLOWER_CREATE_COLLECTION:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[
                    NotificationType.FOLLOWER_CREATE_COLLECTION
                ]
            }`;

        // s3 notification
        case NotificationType.BIDDING:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.BIDDING]
            }`;
        case NotificationType.SOLD:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName} ${
                NotificationMessages[NotificationType.SOLD]
            }`;

        case NotificationType.LISTING:
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return `${notification.from.userName}  ${
                NotificationMessages[NotificationType.LISTING]
            }`;
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
        case NotificationType.LIKE:
        case NotificationType.LIKE_COMMENT:
        case NotificationType.HASHTAG:
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

export function hasImageExtension(text) {
    // Define an array of lowercase image file extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.svg'];

    // Convert the text to lowercase for case-insensitive matching
    const lowercaseText = text.toLowerCase();

    // Check if any of the lowercase image extensions are present in the lowercase text
    return imageExtensions.some((extension) =>
        lowercaseText.includes(extension)
    );
}

export const NotFoundCollectioin =
    'https://res.cloudinary.com/mintstar/image/upload/v1698399995/mintstar/dttttxoezzjglulafecq.png';