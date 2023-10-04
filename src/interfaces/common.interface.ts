import { UserDocument } from 'src/modules/users/entities/user.entity';

export interface AuthenticatedRequest extends Request {
    user: UserDocument;
}

export interface ContextProps {
    req: AuthenticatedRequest;
}

// pagination.types.ts
export interface PaginationOptions {
    cursor?: string;
    limit: number;
    offset?: number;
}

export interface PaginatedResults<T> {
    records: T[];
    pageInfo: {
        page?: number;
        pageSize?: number;
        endCursor?: string;
        totalCount?: number;
        hasNextPage?: boolean;
    };
}

export type Mention = {
    name: string;
    id: string;
};

export type Hashtag = {
    tag: string;
    id?: string;
};

export type MintstargramScoreAction =
    | 'post'
    | 'removePost'
    | 'like'
    | 'unlike'
    | 'comment'
    | 'reply'
    | 'repost'
    | 'repostWithThought'
    | 'follow'
    | 'unfollow'
    | 'followers'
    | 'unfollowers'
    | 'createCollection'
    | 'mint'
    | 'list'
    | 'bid'
    | 'buyNft'
    | 'sellNft'
    | 'profile'
    | 'kyc'
    | 'affiliate';
