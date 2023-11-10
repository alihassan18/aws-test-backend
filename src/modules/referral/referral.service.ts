import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Referral, ReferralDocument } from './entities/referral.entity';
import { UsersService } from '../users/users.service';
import { WithdrawRequest } from './entities/withdraw.requests.entity';

@Injectable()
export class ReferralService {
    constructor(
        // eslint-disable-next-line no-unused-vars
        @InjectModel(Referral.name)
        readonly referralModel: Model<ReferralDocument>,
        @InjectModel(WithdrawRequest.name)
        public withdrawRequestModel: Model<WithdrawRequest>,
        readonly userService: UsersService
    ) {}

    async calculate(userCount: number) {
        if (userCount < 4) {
            return {
                commissionPercentage: 5,
                level: 1
            };
        } else if (userCount < 9) {
            return {
                commissionPercentage: 10,
                level: 2
            };
        } else if (userCount < 19) {
            return {
                commissionPercentage: 15,
                level: 3
            };
        } else if (userCount < 39) {
            return {
                commissionPercentage: 20,
                level: 4
            };
        } else if (userCount < 79) {
            return {
                commissionPercentage: 25,
                level: 5
            };
        } else if (userCount < 159) {
            return {
                commissionPercentage: 30,
                level: 6
            };
        } else if (userCount < 319) {
            return {
                commissionPercentage: 35,
                level: 7
            };
        } else if (userCount < 639) {
            return {
                commissionPercentage: 40,
                level: 8
            };
        } else if (userCount < 1279) {
            return {
                commissionPercentage: 45,
                level: 9
            };
        } else {
            return {
                commissionPercentage: 50,
                level: 10
            };
        }
    }

    async add(
        userId: string,
        otherUser: string
    ): Promise<ReferralDocument | undefined> {
        const refferalUser = await this.referralModel.findOne({
            user: userId,
            requested: true
        });

        if (refferalUser) {
            const totalUsers = refferalUser.count + 1;
            const calculation = await this.calculate(totalUsers);
            const { commissionPercentage, level } = calculation;

            const otherUserDB = await this.userService.findById(
                new Types.ObjectId(otherUser)
            );

            const result = await this.referralModel.findByIdAndUpdate(
                refferalUser?._id,
                {
                    $addToSet: {
                        allReferral: {
                            id: otherUser,
                            createdAt: otherUserDB?.createdAt
                        }
                    },
                    level: level,
                    count: totalUsers,
                    commissionPercentage: commissionPercentage
                },
                { new: true }
            );

            return result;
        } else {
            // password protection
            return this.referralModel.create({
                user: userId,
                requested: true
            });
            // throw new Error('You are not affiliated');
        }
    }

    async get(id: string, duration: string) {
        const refferalUser = await this.referralModel
            .findOne({ user: id, requested: true })
            .lean();
        if (refferalUser) {
            // const filterDataByTimeRange = (data, months) => {
            //     const currentDate = new Date();
            //     const startDate = new Date();
            //     startDate.setMonth(startDate.getMonth() - months);

            //     return data.filter((obj) => {
            //         if (obj.createdAt) {
            //             const date = new Date(obj.createdAt);
            //             return date >= startDate && date <= currentDate;
            //         }
            //         return false;
            //     });
            // };
            const filterDataByTimeRange = (data, months) => {
                // const currentDate = new Date();
                // const startDate = new Date();
                // startDate.setMonth(startDate.getMonth() - months);

                // const filteredData = data.filter((obj) => {
                //     if (obj.createdAt) {
                //         const date = new Date(obj.createdAt);
                //         return date >= startDate && date <= currentDate;
                //     }
                //     return false;
                // });
                const currentDate = new Date();
                currentDate.setUTCHours(23, 59, 59, 999); // Set time to end of the day in UTC

                const startDate = new Date();
                startDate.setMonth(startDate.getMonth() - months);
                startDate.setUTCHours(0, 0, 0, 0); // Set time to the start of the day in UTC

                const filteredData = data.filter((obj) => {
                    if (obj.createdAt) {
                        const date = new Date(obj.createdAt);
                        date.setUTCHours(date.getUTCHours()); // Set the date's time zone to UTC
                        return date >= startDate && date <= currentDate;
                    }
                    return false;
                });

                // Add missing dates within the time range
                const allDatesInRange = [];
                const currentDateInRange = new Date(startDate);
                while (currentDateInRange <= currentDate) {
                    allDatesInRange.push(currentDateInRange.toISOString());
                    currentDateInRange.setDate(
                        currentDateInRange.getDate() + 1
                    );
                }

                const missingDates = allDatesInRange.filter(
                    (date) =>
                        !filteredData.find((obj) => obj.createdAt === date)
                );

                missingDates.forEach((date) => {
                    filteredData.push({
                        createdAt: new Date(date),
                        data: [],
                        count: 0
                        // Set other properties as needed
                    });
                });

                return filteredData;
            };

            const groupedArray = refferalUser.allReferral.reduce((acc, obj) => {
                if (obj.createdAt) {
                    const date = new Date(obj.createdAt).toLocaleDateString();

                    if (!acc[date]) {
                        acc[date] = {
                            count: 0,
                            data: []
                        };
                    }

                    acc[date].data.push(obj);
                    acc[date].count = acc[date].data.length;
                    acc[date].createdAt = obj.createdAt;
                }

                return acc;
            }, {});

            const oneMonthData = filterDataByTimeRange(
                Object.values(groupedArray),
                1
            );
            const threeMonthsData = filterDataByTimeRange(
                Object.values(groupedArray),
                3
            );
            const oneYearData = filterDataByTimeRange(
                Object.values(groupedArray),
                12
            );

            // console.log(groupedArray,'groupedArraygroupedArraygroupedArray',oneMonthData);

            const graphData =
                duration == '1_MONTH'
                    ? oneMonthData
                    : duration == '3_MONTH'
                    ? threeMonthsData
                    : duration == '12_MONTH'
                    ? oneYearData
                    : Object.values(groupedArray);

            return { affiliatedData: refferalUser, graphData: graphData };
            // return refferalUser;
        } else {
            throw new Error('You are not affiliated');
        }
    }

    async create(id: string) {
        const isAlreadyRequested = await this.referralModel.findOne({
            user: id,
            requested: false
        });
        if (isAlreadyRequested) {
            return {
                status: true,
                message: 'Your request for affiliation is already submited'
            };
        } else {
            await this.referralModel.create({
                user: id,
                allReferral: [],
                requested: false
            });
        }
        return {
            status: true,
            message: 'Your request for affiliation is submited'
        };
    }

    async userReferrals(id: Types.ObjectId) {
        const allReferral = await this.referralModel.aggregate([
            {
                $unwind: '$allReferral'
            },
            {
                $match: {
                    user: id // Match the userId
                }
            },
            {
                $lookup: {
                    from: 'users',
                    // The User model collection name
                    localField: 'allReferral.id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $sort: {
                    'user.createdAt': -1
                }
            },
            {
                $lookup:
                    /**
                     * from: The target collection.
                     * localField: The local join field.
                     * foreignField: The target join field.
                     * as: The name for the results.
                     * pipeline: Optional pipeline to run on the foreign collection.
                     * let: Optional variables to use in the pipeline field stages.
                     */
                    {
                        from: 'referrals',
                        localField: 'user._id',
                        foreignField: 'user',
                        as: 'referral'
                    }
            },
            {
                $unwind: '$referral'
            },
            {
                $lookup: {
                    from: 'wallets',
                    // Assuming the wallets collection stores the transactions
                    localField: 'user._id',
                    foreignField: 'userId',
                    as: 'wallets'
                }
            },
            {
                $unwind:
                    // "$wallets"
                    {
                        path: '$wallets',
                        preserveNullAndEmptyArrays: true
                    }
            },
            {
                $lookup: {
                    from: 'sales',
                    let: {
                        userWalletAddress: {
                            $toLower: '$wallets.address'
                        },
                        commissionPercentage: '$referral.commissionPercentage'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $in: [
                                                {
                                                    $toLower: '$to'
                                                },
                                                ['$$userWalletAddress'] // Here $$userWalletAddress is an array of addresses
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: '$$userWalletAddress',
                                // Group by the wallet address
                                totalBuyVolume: {
                                    $sum: '$price.amount.native'
                                },
                                buys: {
                                    $sum: 1 // Count the number of buys for each wallet address
                                }
                            }
                        },
                        {
                            $addFields: {
                                ourCommission: {
                                    $multiply: ['$totalBuyVolume', 2.5] // Calculate the commission based on total buy volume
                                }
                            }
                        },
                        {
                            $addFields: {
                                yourCommission: {
                                    $multiply: ['$ourCommission', 0.2] // Calculate your commission as 20% of our commission
                                }
                            }
                        }
                    ],

                    as: 'salesInfo' // The results will be an array of sales info per wallet address
                }
            },
            {
                $unwind: {
                    path: '$salesInfo',
                    preserveNullAndEmptyArrays: true // Keep users even if they don't have sales
                }
            },
            // Add other necessary lookup or join stages to get the transaction data related to buys, volumes, etc.
            // After you have all necessary data, you can calculate the commissions, levels, etc., using the $addFields stage
            {
                $addFields: {
                    volume: '$salesInfo.totalBuyVolume',
                    buys: '$salesInfo.buys',
                    // This should be calculated based on actual data
                    // This should be calculated based on actual data
                    yourCommission: '$salesInfo.yourCommission',
                    // 20% of our commission
                    // This should be calculated based on actual data
                    affiliateLevel: 4,
                    // This should be calculated based on actual data
                    ourCommission: '$salesInfo.ourCommission' // This should be calculated based on actual data
                }
            },
            {
                $group: {
                    _id: null,
                    allReferral: {
                        $push: {
                            user: '$user',
                            wallets: '$wallets',
                            buys: '$buys',
                            totalBuyVolume: '$totalBuyVolume',
                            ourCommission: '$ourCommission',
                            affiliateLevel: '$affiliateLevel',
                            yourCommission: '$yourCommission',
                            referral: '$referral',
                            volume: '$volume'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    allReferral: 1
                }
            }
        ]);

        return allReferral[0]?.allReferral || [];
        // return this.userService.userModel.find({ referral: id });
    }
    async userRewards(id: Types.ObjectId) {
        const rewards = await this.referralModel.aggregate([
            {
                $unwind: '$allReferral'
            },
            {
                $match: {
                    user: id // Match the userId
                }
            },
            {
                $lookup: {
                    from: 'users',
                    // The User model collection name
                    localField: 'allReferral.id',
                    foreignField: '_id',
                    as: 'referrer'
                }
            },
            {
                $unwind: '$referrer'
            },
            {
                $sort: {
                    'referrer.createdAt': -1
                }
            },
            {
                $lookup:
                    /**
                     * from: The target collection.
                     * localField: The local join field.
                     * foreignField: The target join field.
                     * as: The name for the results.
                     * pipeline: Optional pipeline to run on the foreign collection.
                     * let: Optional variables to use in the pipeline field stages.
                     */
                    {
                        from: 'referrals',
                        localField: 'referrer._id',
                        foreignField: 'user',
                        as: 'referral'
                    }
            },
            {
                $unwind: '$referral'
            },
            {
                $lookup: {
                    from: 'wallets',
                    // Assuming the wallets collection stores the transactions
                    localField: 'referrer._id',
                    foreignField: 'userId',
                    as: 'wallets'
                }
            },
            {
                $unwind:
                    // "$wallets"
                    {
                        path: '$wallets',
                        preserveNullAndEmptyArrays: true
                    }
            },
            {
                $lookup: {
                    from: 'sales',
                    let: {
                        userWalletAddress: {
                            $toLower: '$wallets.address'
                        },
                        commissionPercentage: '$referral.commissionPercentage'
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $in: [
                                                {
                                                    $toLower: '$to'
                                                },
                                                ['$$userWalletAddress'] // Here $$userWalletAddress is an array of addresses
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        {
                            $group: {
                                _id: '$$userWalletAddress',
                                // Group by the wallet address
                                totalBuyVolume: {
                                    $sum: '$price.amount.native'
                                },
                                buys: {
                                    $sum: 1 // Count the number of buys for each wallet address
                                }
                            }
                        },
                        {
                            $addFields: {
                                ourCommission: {
                                    $multiply: ['$totalBuyVolume', 2.5] // Calculate the commission based on total buy volume
                                }
                            }
                        },
                        {
                            $addFields: {
                                yourCommission: {
                                    $multiply: ['$ourCommission', 0.2] // Calculate your commission as 20% of our commission
                                }
                            }
                        }
                    ],

                    as: 'salesInfo' // The results will be an array of sales info per wallet address
                }
            },
            {
                $unwind: {
                    path: '$salesInfo',
                    preserveNullAndEmptyArrays: true // Keep users even if they don't have sales
                }
            },
            // Add other necessary lookup or join stages to get the transaction data related to buys, volumes, etc.
            // After you have all necessary data, you can calculate the commissions, levels, etc., using the $addFields stage
            {
                $addFields: {
                    buys: '$salesInfo.buys',
                    volume: '$salesInfo.totalBuyVolume',
                    // This should be calculated based on actual data
                    // This should be calculated based on actual data
                    yourCommission: '$salesInfo.yourCommission',
                    // 20% of our commission
                    // This should be calculated based on actual data
                    affiliateLevel: 4,
                    // This should be calculated based on actual data
                    ourCommission: '$salesInfo.ourCommission' // This should be calculated based on actual data
                }
            },
            {
                $group: {
                    _id: '$user',
                    rewards: {
                        $sum: '$yourCommission'
                    },
                    volume: {
                        $sum: '$volume'
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    rewards: 1,
                    volume: 1,
                    payouts: 1
                }
            }
        ]);
        console.log(rewards, 'rewards');

        return rewards[0];
        // return this.userService.userModel.find({ referral: id });
    }

    async createWithdrawRequest(
        userId: string,
        address: string,
        amount: number
    ): Promise<WithdrawRequest> {
        // Check if there is an existing pending withdraw request for the user
        const existingRequest = await this.withdrawRequestModel.findOne({
            userId,
            status: 'pending'
        });

        if (existingRequest) {
            // If a pending request exists, throw an exception to prevent creating a new request
            throw new BadRequestException(
                'You already have a pending withdrawal request.'
            );
        }

        // If no pending request exists, create a new withdraw request
        const withdrawRequest = new this.withdrawRequestModel({
            userId,
            amount,
            status: 'pending',
            processed: false,
            address
        });

        return withdrawRequest.save();
    }

    async getAllWithdrawRequests(): Promise<WithdrawRequest[]> {
        return this.withdrawRequestModel.find();
    }

    async updateStatus(
        requestId: Types.ObjectId,
        newStatus: string
    ): Promise<WithdrawRequest> {
        const updatedRequest =
            await this.withdrawRequestModel.findByIdAndUpdate(
                requestId,
                { status: newStatus },
                { new: true }
            );
        if (!updatedRequest) {
            throw new Error('WithdrawRequest not found');
        }
        return updatedRequest;
    }
}
