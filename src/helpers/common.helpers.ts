import * as crypto from 'crypto';
import {
    Hashtag,
    MintstargramScoreAction,
    Mention
} from 'src/interfaces/common.interface';

export const generateRandomNumber = () => {
    const random = Math.floor(100000 + Math.random() * 900000);
    return random;
};

export const extractMentionsAndHashtags = (
    text: string
): { mentions: Mention[]; hashtags: Hashtag[] } => {
    const mentionRegex = /@\[(.*?)\]\((.*?)\)/g;
    const hashtagRegex = /(?:#\[(.*?)\]\((.*?)\))|(?:#(\w+))/g;

    const mentions: Mention[] = [];
    const hashtags: Hashtag[] = [];

    let mentionMatch;
    while ((mentionMatch = mentionRegex.exec(text)) !== null) {
        mentions.push({ name: mentionMatch[1], id: mentionMatch[2] });
    }

    let hashtagMatch;
    while ((hashtagMatch = hashtagRegex.exec(text)) !== null) {
        if (hashtagMatch[1] && hashtagMatch[2]) {
            hashtags.push({ tag: hashtagMatch[1], id: hashtagMatch[2] });
        } else if (hashtagMatch[3]) {
            hashtags.push({ tag: hashtagMatch[3] });
        }
    }

    return { mentions, hashtags };
};

export const generateRandomState = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

export const convertMarkupToString = (input: string) => {
    const mentionRegex = /@\[([^\]]+)\]\(([^\\)]+)\)/g;
    const tagRegex = /#\[([^\]]+)\]\(([^\\)]+)\)/g;

    const result = input.replace(mentionRegex, '@$1').replace(tagRegex, '#$1');
    return result;
};

export const differenceInSeconds = (date1: Date, date2: Date) => {
    // Convert both dates to milliseconds
    const date1_ms = date1.getTime();
    const date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    const difference_ms = date1_ms - date2_ms;

    // Convert back to seconds and return
    return Math.floor(difference_ms / 1000);
};

export const mintstargramScore = (action: MintstargramScoreAction) => {
    let score = 0;
    switch (action) {
        case 'post':
            score = 5;
            break;
        case 'removePost':
            score = -5;
            break;
        case 'like':
            score = 1;
            break;
        case 'unlike':
            score = -1;
            break;
        case 'comment':
            score = 3;
            break;
        case 'reply':
            score = 3;
            break;
        case 'repost':
            score = 3;
            break;
        case 'repostWithThought':
            // score = 5;
            score = 0;
            break;
        case 'follow':
            score = 50;
            break;
        case 'unfollow':
            score = -1;
            break;
        case 'followers':
            score = 50;
            break;
        case 'unfollowers':
            score = -5;
            break;
        case 'createCollection':
            score = 1000;
            break;
        case 'mint':
            score = 1000;
            break;
        case 'list':
            score = 100;
            break;
        case 'bid':
            score = 100;
            break;
        case 'buyNft':
            score = 1000;
            break;
        case 'sellNft':
            score = 1000;
            break;
        case 'profile':
            score = 50;
            break;
        case 'kyc':
            score = 1000;
            break;
        case 'affiliate':
            score = 1000;
            break;
    }
    return score;
};

export function getGameFlowerOpenTime(date: Date) {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + 20);
    return newDate;
}

export function convertHashesMentionsToSimpleText(text) {
    /* eslint-disable no-useless-escape */
    const hashtagRegex = /\#\[(.+?)\]\(\w+\)/g;
    /* eslint-disable no-useless-escape */
    const userMentionRegex = /\@\[([^\]]+)\]\(\w+\)/g;
    const linkRegex = /\$\[([^\]]+)\]\(([^)]+)\)/g;

    const convertedText = text
        ? text
              .replace(hashtagRegex, '#$1')
              .replace(userMentionRegex, '@$1')
              .replace(linkRegex, '$1')
        : text;

    return convertedText;
}
