import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { USERS } from 'src/constants/db.collections';
import { UserDocument } from '../users/entities/user.entity';
import { Model } from 'mongoose';
import { UsersDataOutput } from './dto/create-admin.input';
import { PublicFeedsGateway } from '../gateways/public/public-feeds.gateway';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(USERS) readonly userModel: Model<UserDocument>,
        @Inject(forwardRef(() => PublicFeedsGateway))
        private publicFeedsGateway: PublicFeedsGateway
    ) {}

    async usersStats() {
        const usersDataOver = await this.userModel.aggregate([
            {
                $facet: {
                    usersCount: [
                        {
                            $match: {
                                $expr: {
                                    $ifNull: ['$isActive', false]
                                }
                            }
                        },
                        { $count: 'count' }
                    ],
                    kycCount: [
                        {
                            $match: {
                                $expr: {
                                    $ifNull: ['$isVerified', false]
                                }
                            }
                        },
                        { $count: 'count' }
                    ],
                    contentCreators: [
                        {
                            $match: {
                                $expr: {
                                    $ifNull: ['$isSCC', false]
                                }
                            }
                        },
                        { $count: 'count' }
                    ],
                    blockedUsersCount: [
                        {
                            $match: {
                                $expr: {
                                    $ifNull: ['$isBlocked', false]
                                }
                            }
                        },
                        { $count: 'count' }
                    ],
                    bannedUsersCount: [
                        {
                            $match: {
                                $expr: {
                                    $ifNull: ['$isBanned', false]
                                }
                            }
                        },
                        { $count: 'count' }
                    ]
                }
            },
            {
                $project: {
                    usersCount: { $arrayElemAt: ['$usersCount.count', 0] },
                    kycCount: { $arrayElemAt: ['$kycCount.count', 0] },
                    contentCreators: {
                        $arrayElemAt: ['$contentCreators.count', 0]
                    },
                    blockedUsersCount: {
                        $arrayElemAt: ['$blockedUsersCount.count', 0]
                    },
                    bannedUsersCount: {
                        $arrayElemAt: ['$bannedUsersCount.count', 0]
                    }
                }
            },
            {
                $lookup: {
                    from: 'reactions',
                    let: {},
                    pipeline: [
                        { $match: { emoji: 'like' } },
                        { $count: 'likeCount' }
                    ],
                    as: 'likeCount'
                }
            },
            {
                $lookup: {
                    from: 'feeds',
                    let: {},
                    pipeline: [
                        { $match: { type: 'COMMENT' } },
                        { $count: 'commentsCount' }
                    ],
                    as: 'commentsCount'
                }
            },
            {
                $lookup: {
                    from: 'feeds',
                    let: {},
                    pipeline: [
                        { $match: { type: 'REPOST' } },
                        { $count: 'repostsCount' }
                    ],
                    as: 'repostsCount'
                }
            },
            {
                $lookup: {
                    from: 'feeds',
                    let: {},
                    pipeline: [
                        { $match: { type: 'POST' } },
                        { $count: 'postsCount' }
                    ],
                    as: 'postsCount'
                }
            },
            {
                $lookup: {
                    from: 'hashtags',
                    let: {},
                    pipeline: [{ $count: 'hashtagCount' }],
                    as: 'hashtagCount'
                }
            },
            {
                $lookup: {
                    from: 'groups',
                    let: {},
                    pipeline: [{ $count: 'groupsCount' }],
                    as: 'groupsCount'
                }
            },
            {
                $lookup: {
                    from: 'posts',
                    let: {},
                    pipeline: [
                        {
                            $match: {
                                $or: [
                                    { twitterPost: true },
                                    { linkedinPost: true },
                                    { facebookPost: true },
                                    { instagramPost: true }
                                ]
                            }
                        },
                        { $count: 'sharedPosts' }
                    ],
                    as: 'sharedPosts'
                }
            },
            {
                $project: {
                    usersCount: 1,
                    kycCount: 1,
                    contentCreators: 1,
                    blockedUsersCount: 1,
                    bannedUsersCount: 1,
                    likeCount: { $arrayElemAt: ['$likeCount.likeCount', 0] },
                    commentsCount: {
                        $arrayElemAt: ['$commentsCount.commentsCount', 0]
                    },
                    repostsCount: {
                        $arrayElemAt: ['$repostsCount.repostsCount', 0]
                    },
                    postsCount: { $arrayElemAt: ['$postsCount.postsCount', 0] },
                    hashtagCount: {
                        $arrayElemAt: ['$hashtagCount.hashtagCount', 0]
                    },
                    groupsCount: {
                        $arrayElemAt: ['$groupsCount.groupsCount', 0]
                    },
                    sharedPosts: {
                        $arrayElemAt: ['$sharedPosts.sharedPosts', 0]
                    }
                }
            }
        ]);
        return usersDataOver[0];
    }

    async usersGraphStats() {
        const currentDate = new Date();
        const thirtyDaysAgo = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate() - 29
        );

        const formatOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            timeZone: 'UTC'
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const datePartsFormatter = new Intl.DateTimeFormat('en', formatOptions);

        const data = await this.userModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $bucket: {
                    groupBy: '$createdAt',
                    boundaries: [...Array(31)].map((_, i) => {
                        const date = new Date(
                            thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000
                        );
                        const formattedDateParts =
                            datePartsFormatter.formatToParts(date);
                        return new Date(
                            Date.UTC(
                                parseInt(formattedDateParts[4].value, 10),
                                parseInt(formattedDateParts[0].value, 10) - 1,
                                parseInt(formattedDateParts[2].value, 10)
                            )
                        );
                    }),
                    default: null,
                    output: {
                        count: { $sum: 1 }
                    }
                }
            },
            {
                $project: {
                    date: {
                        $dateToString: { format: '%Y-%m-%d', date: '$_id' }
                    },
                    count: 1,
                    _id: 0
                }
            }
        ]);

        const dateRange = [];
        for (
            let date = thirtyDaysAgo;
            date <= currentDate;
            date.setDate(date.getDate() + 1)
        ) {
            dateRange.push(new Date(date));
        }

        // Map missing dates to the result with count 0
        const result = dateRange.map((date) => {
            const formattedDate = date.toISOString().slice(0, 10);
            const dataForDate = data.find(
                (item) => item.date === formattedDate
            );
            return {
                count: dataForDate ? dataForDate.count : 0,
                date: formattedDate
            };
        });

        return result;
    }

    async todayUsersStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayDataOver = await this.userModel.aggregate([
            {
                $facet: {
                    usersCount: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $ifNull: ['$isActive', false] },
                                        { $gte: ['$lastLogin', today] }
                                    ]
                                }
                            }
                        },
                        { $count: 'count' }
                    ],
                    kycCount: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $ifNull: ['$isVerified', false] },
                                        { $gte: ['$lastLogin', today] }
                                    ]
                                }
                            }
                        },
                        { $count: 'count' }
                    ],
                    contentCreators: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $ifNull: ['$isSCC', false] },
                                        { $gte: ['$lastLogin', today] }
                                    ]
                                }
                            }
                        },
                        { $count: 'count' }
                    ],
                    blockedUsersCount: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $ifNull: ['$isBlocked', false] },
                                        { $gte: ['$lastLogin', today] }
                                    ]
                                }
                            }
                        },
                        { $count: 'count' }
                    ],
                    bannedUsersCount: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $ifNull: ['$isBanned', false] },
                                        { $gte: ['$lastLogin', today] }
                                    ]
                                }
                            }
                        },
                        { $count: 'count' }
                    ]
                }
            },
            {
                $project: {
                    usersCount: { $arrayElemAt: ['$usersCount.count', 0] },
                    kycCount: { $arrayElemAt: ['$kycCount.count', 0] },
                    contentCreators: {
                        $arrayElemAt: ['$contentCreators.count', 0]
                    },
                    blockedUsersCount: {
                        $arrayElemAt: ['$blockedUsersCount.count', 0]
                    },
                    bannedUsersCount: {
                        $arrayElemAt: ['$bannedUsersCount.count', 0]
                    }
                }
            },
            {
                $lookup: {
                    from: 'reactions',
                    let: {},
                    pipeline: [
                        {
                            $match: {
                                emoji: 'like',
                                $expr: {
                                    $gte: ['$createdAt', today]
                                }
                            }
                        },
                        { $count: 'likeCount' }
                    ],
                    as: 'likeCount'
                }
            },
            {
                $lookup: {
                    from: 'feeds',
                    let: {},
                    pipeline: [
                        {
                            $match: {
                                type: 'COMMENT',
                                $expr: {
                                    $gte: ['$createdAt', today]
                                }
                            }
                        },
                        { $count: 'commentsCount' }
                    ],
                    as: 'commentsCount'
                }
            },
            {
                $lookup: {
                    from: 'feeds',
                    let: {},
                    pipeline: [
                        {
                            $match: {
                                type: 'REPOST',
                                $expr: {
                                    $gte: ['$createdAt', today]
                                }
                            }
                        },
                        { $count: 'repostsCount' }
                    ],
                    as: 'repostsCount'
                }
            },
            {
                $lookup: {
                    from: 'feeds',
                    let: {},
                    pipeline: [
                        {
                            $match: {
                                type: 'POST',
                                $expr: {
                                    $gte: ['$createdAt', today]
                                }
                            }
                        },
                        { $count: 'postsCount' }
                    ],
                    as: 'postsCount'
                }
            },
            {
                $lookup: {
                    from: 'hashtags',
                    let: {},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $gte: ['$createdAt', today]
                                }
                            }
                        },
                        { $count: 'hashtagCount' }
                    ],
                    as: 'hashtagCount'
                }
            },
            {
                $lookup: {
                    from: 'groups',
                    let: {},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $gte: ['$createdAt', today]
                                }
                            }
                        },
                        { $count: 'groupsCount' }
                    ],
                    as: 'groupsCount'
                }
            },
            {
                $lookup: {
                    from: 'posts',
                    let: {},
                    pipeline: [
                        {
                            $match: {
                                $or: [
                                    { twitterPost: true },
                                    { linkedinPost: true },
                                    { facebookPost: true },
                                    { instagramPost: true }
                                ],
                                $expr: {
                                    $gte: ['$createdAt', today]
                                }
                            }
                        },
                        { $count: 'sharedPosts' }
                    ],
                    as: 'sharedPosts'
                }
            },
            {
                $project: {
                    usersCount: 1,
                    kycCount: 1,
                    contentCreators: 1,
                    blockedUsersCount: 1,
                    bannedUsersCount: 1,
                    likeCount: { $arrayElemAt: ['$likeCount.likeCount', 0] },
                    commentsCount: {
                        $arrayElemAt: ['$commentsCount.commentsCount', 0]
                    },
                    repostsCount: {
                        $arrayElemAt: ['$repostsCount.repostsCount', 0]
                    },
                    postsCount: { $arrayElemAt: ['$postsCount.postsCount', 0] },
                    hashtagCount: {
                        $arrayElemAt: ['$hashtagCount.hashtagCount', 0]
                    },
                    groupsCount: {
                        $arrayElemAt: ['$groupsCount.groupsCount', 0]
                    },
                    sharedPosts: {
                        $arrayElemAt: ['$sharedPosts.sharedPosts', 0]
                    }
                }
            }
        ]);
        return todayDataOver[0];
    }

    async usersData(
        page: number,
        filter: string,
        search: string
    ): Promise<UsersDataOutput> {
        const pageSize = 20;
        const currentPage = page || 1;
        const skipCount = (currentPage - 1) * pageSize;
        const matchStage = {
            $match: {
                $expr: {
                    $cond: {
                        if: { $eq: [search, ''] },
                        then: {},
                        else: {
                            $regexMatch: {
                                input: '$userName',
                                regex: search,
                                options: 'i'
                            }
                        }
                    }
                },
                ...(filter === 'blocked' ? { isBlocked: true } : {}),
                ...(filter === 'banned' ? { isBanned: true } : {})
            }
        };
        const count = await this.userModel.countDocuments({});
        const data = await this.userModel.aggregate([
            { $sort: filter ? { [filter]: -1 } : { _id: -1 } },
            matchStage,
            {
                $lookup: {
                    from: 'feeds',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$owner', '$$userId'] },
                                $or: [
                                    { type: 'POST' },
                                    { type: 'REPOST' },
                                    { type: 'COMMENT' }
                                ]
                            }
                        },
                        {
                            $facet: {
                                postCount: [
                                    { $match: { type: 'POST' } },
                                    { $count: 'count' }
                                ],
                                repostCount: [
                                    { $match: { type: 'REPOST' } },
                                    { $count: 'count' }
                                ],
                                commentCount: [
                                    { $match: { type: 'COMMENT' } },
                                    { $count: 'count' }
                                ]
                            }
                        }
                    ],
                    as: 'feedCounts'
                }
            },
            {
                $unwind: {
                    path: '$feedCounts',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    avatar: 1,
                    userName: 1,
                    followersCount: 1,
                    followingCount: 1,
                    points: 1,
                    createdAt: 1,
                    lastLogin: 1,
                    boughtNFTs: 1,
                    mintedNFTs: 1,
                    soldNFTs: 1,
                    listedNFTs: 1,
                    isBlocked: {
                        $ifNull: ['$isBlocked', false]
                    },
                    isBanned: {
                        $ifNull: ['$isBanned', false]
                    },
                    isVerified: {
                        $ifNull: ['$isVerified', false]
                    },
                    isSCC: {
                        $ifNull: ['$isSCC', false]
                    },
                    postCount: {
                        $ifNull: [
                            {
                                $arrayElemAt: ['$feedCounts.postCount.count', 0]
                            },
                            0
                        ]
                    },
                    repostCount: {
                        $ifNull: [
                            {
                                $arrayElemAt: [
                                    '$feedCounts.repostCount.count',
                                    0
                                ]
                            },
                            0
                        ]
                    },
                    commentCount: {
                        $ifNull: [
                            {
                                $arrayElemAt: [
                                    '$feedCounts.commentCount.count',
                                    0
                                ]
                            },
                            0
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: 'reactions', // Collection name: "reactions"
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$user', '$$userId'] },
                                emoji: 'like'
                            }
                        },
                        {
                            $count: 'likeCount'
                        }
                    ],
                    as: 'reactionCounts'
                }
            },
            {
                $project: {
                    avatar: 1,
                    userName: 1,
                    followersCount: 1,
                    followingCount: 1,
                    points: 1,
                    postCount: 1,
                    repostCount: 1,
                    commentCount: 1,
                    createdAt: 1,
                    lastLogin: 1,
                    isVerified: 1,
                    isBlocked: 1,
                    isBanned: 1,
                    isSCC: 1,
                    boughtNFTs: 1,
                    mintedNFTs: 1,
                    soldNFTs: 1,
                    listedNFTs: 1,
                    likeCount: {
                        $ifNull: [
                            { $arrayElemAt: ['$reactionCounts.likeCount', 0] },
                            0
                        ]
                    }
                }
            },
            { $skip: skipCount },
            { $limit: pageSize }
        ]);
        return {
            pageSize,
            currentPage,
            next: pageSize * currentPage < count,
            data
        };
    }

    async blockUserByAdmin(id: string, status: boolean) {
        await this.userModel.findByIdAndUpdate(id, {
            $set: { isBlocked: status }
        });
         if (status) {
            this.publicFeedsGateway.emitBlockUserByAdmin(id);
        }
        return { success: true };
    }

    async banUserByAdmin(id: string, status: boolean) {
        await this.userModel.findByIdAndUpdate(id, {
            $set: { isBanned: status }
        });
        if (status) {
            this.publicFeedsGateway.emitBlockUserByAdmin(id);
        }

        return { success: true };
    }

    // ------------------------------------------- AFFILIATE -----------------------------------------------------

    async affiliateStats() {
        const data = await this.userModel.aggregate([
            {
                $facet: {
                    affiliatedUsersCount: [
                        {
                            $match: {
                                affiliatedUser: true
                            }
                        },
                        {
                            $count: 'count'
                        }
                    ],
                    referralUsers: [
                        {
                            $match: {
                                referral: { $exists: true }
                            }
                        },
                        {
                            $count: 'count'
                        }
                    ]
                }
            },
            {
                $project: {
                    affiliatedUsersCount: {
                        $arrayElemAt: ['$affiliatedUsersCount.count', 0]
                    },
                    referralUsers: { $arrayElemAt: ['$referralUsers.count', 0] }
                }
            },
            {
                $lookup: {
                    from: 'referralvideos',
                    let: {},
                    pipeline: [{ $count: 'referralVideos' }],
                    as: 'referralVideos'
                }
            },
            {
                $project: {
                    affiliatedUsersCount: 1,
                    referralUsers: 1,
                    referralVideos: {
                        $arrayElemAt: ['$referralVideos.referralVideos', 0]
                    }
                }
            }
        ]);
        return data[0];
    }

    async affiliateUsers(search?: string) {
        const data = await this.userModel.aggregate([
            {
                $match: {
                    affiliatedUser: true,
                    $expr: {
                        $cond: {
                            if: { $eq: [search, ''] }, // Check if searchTerm is an empty string
                            then: {},
                            else: {
                                $regexMatch: {
                                    input: '$userName',
                                    regex: search,
                                    options: 'i' // 'i' for case-insensitive search
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    avatar: 1,
                    userName: 1,
                    followersCount: 1,
                    followingCount: 1,
                    isVerified: { $ifNull: ['$isVerified', false] },
                    isBlocked: { $ifNull: ['$isBlocked', false] },
                    isBanned: { $ifNull: ['$isBanned', false] },
                    isSCC: { $ifNull: ['$isSCC', false] }
                }
            },
            {
                $lookup: {
                    from: 'referrals',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'referralData'
                }
            },
            {
                $lookup: {
                    from: 'referralvideos',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $project: {
                                videoShared: {
                                    $sum: [
                                        {
                                            $cond: [
                                                { $in: ['$$userId', '$fb'] },
                                                1,
                                                0
                                            ]
                                        },
                                        {
                                            $cond: [
                                                {
                                                    $in: [
                                                        '$$userId',
                                                        '$whatsapp'
                                                    ]
                                                },
                                                1,
                                                0
                                            ]
                                        },
                                        {
                                            $cond: [
                                                {
                                                    $in: [
                                                        '$$userId',
                                                        '$twitter'
                                                    ]
                                                },
                                                1,
                                                0
                                            ]
                                        },
                                        {
                                            $cond: [
                                                {
                                                    $in: [
                                                        '$$userId',
                                                        '$linkedin'
                                                    ]
                                                },
                                                1,
                                                0
                                            ]
                                        },
                                        {
                                            $cond: [
                                                {
                                                    $in: [
                                                        '$$userId',
                                                        '$instagram'
                                                    ]
                                                },
                                                1,
                                                0
                                            ]
                                        },
                                        {
                                            $cond: [
                                                {
                                                    $in: ['$$userId', '$tiktok']
                                                },
                                                1,
                                                0
                                            ]
                                        },
                                        {
                                            $cond: [
                                                {
                                                    $in: [
                                                        '$$userId',
                                                        '$youtube'
                                                    ]
                                                },
                                                1,
                                                0
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'referralVideoData'
                }
            },
            {
                $project: {
                    avatar: 1,
                    userName: 1,
                    followersCount: 1,
                    followingCount: 1,
                    isVerified: 1,
                    isBlocked: 1,
                    isBanned: 1,
                    isSCC: 1,
                    referralCount: { $arrayElemAt: ['$referralData.count', 0] },
                    referralLevel: { $arrayElemAt: ['$referralData.level', 0] },
                    commissionPercentage: {
                        $arrayElemAt: ['$referralData.commissionPercentage', 0]
                    },
                    videoShared: {
                        $arrayElemAt: ['$referralVideoData.videoShared', 0]
                    }
                }
            }
        ]);
        return data;
    }
}
