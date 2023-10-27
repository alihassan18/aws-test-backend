import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Referral, ReferralDocument } from './entities/referral.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReferralService {
    constructor(
        // eslint-disable-next-line no-unused-vars
        @InjectModel(Referral.name)
        readonly referralModel: Model<ReferralDocument>,
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

            const result = await this.referralModel.findByIdAndUpdate(
                refferalUser?._id,
                {
                    $addToSet: { allReferral: { id: otherUser } },
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
                const currentDate = new Date();
                const startDate = new Date();
                startDate.setMonth(startDate.getMonth() - months);

                const filteredData = data.filter((obj) => {
                    if (obj.createdAt) {
                        const date = new Date(obj.createdAt);
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
                    from: 'users', // The User model collection name
                    localField: 'allReferral.id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: '$user'
            },
            {
                $sort: { 'user.createdAt': -1 }
            },
            {
                $group: {
                    _id: null,
                    allReferral: { $push: '$user' }
                }
            },
            {
                $project: {
                    _id: 0,
                    allReferral: 1
                }
            }
        ]);
        console.log(allReferral[0]?.allReferral);

        return allReferral[0]?.allReferral || [];
        // return this.userService.userModel.find({ referral: id });
    }
}
