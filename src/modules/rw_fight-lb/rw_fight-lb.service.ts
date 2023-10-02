import { Injectable } from '@nestjs/common';
import { CreateRwFightLbInput } from './dto/create-rw_fight-lb.input';
import { InjectModel } from '@nestjs/mongoose';
import { RwFightLBDocument, RwFightLb } from './entities/rw_fight-lb.entity';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notifications/notification.service';
import {
    ENotificationFromType,
    NotificationType
} from '../notifications/notifications.enum';

@Injectable()
export class RwFightLbService {
    constructor(
        @InjectModel(RwFightLb.name)
        readonly rwFightLBModel: Model<RwFightLBDocument>,
        private readonly userService: UsersService,
        private readonly notificationService: NotificationService
    ) {}

    async create(createRwFightLbInput: CreateRwFightLbInput) {
        // const fight = await this.rwFightLBModel.findOne({
        //     email: createRwFightLbInput.email
        // });
        // if (fight) {
        //     return this.rwFightLBModel.findOneAndUpdate(
        //         { email: createRwFightLbInput.email },
        //         { $set: { ...createRwFightLbInput } },
        //         { new: true }
        //     );
        // } else {
        //     return this.rwReportModel.create(createRwFightLbInput);
        // }
        return this.rwFightLBModel.create(createRwFightLbInput);
    }

    async findAll(count?: number) {
        const result = await this.rwFightLBModel.aggregate([
            {
                $group: {
                    _id: '$email',
                    totalDamage: { $sum: '$damage' },
                    name: { $first: '$name' },
                    email: { $first: '$email' },
                    userId: { $first: '$_id' },
                    deathTime: { $first: '$deathTime' },
                    updateTime: { $first: '$updateTime' }
                }
            },
            {
                $sort: { totalDamage: -1 }
            },
            {
                $limit: count ? count : 100000000000
            },
            {
                $project: {
                    _id: '$userId',
                    email: 1,
                    name: 1,
                    damage: '$totalDamage',
                    deathTime: 1,
                    updateTime: 1
                }
            }
        ]);

        // const result = await this.rwFightLBModel.aggregate([
        //     {
        //         $group: {
        //             _id: '$email',
        //             totalDamage: { $sum: '$damage' },
        //             name: { $first: '$name' },
        //             email: { $first: '$email' },
        //             userId: { $first: '$_id' },
        //             deathTime: { $first: '$deathTime' },
        //             updateTime: { $first: '$updateTime' }
        //         }
        //     },
        //     {
        //         $sort: { totalDamage: -1 }
        //     },
        //     {
        //         $limit: count ? count : 100000000000
        //     },
        //     {
        //         $lookup: {
        //             from: 'user', // The name of the user collection
        //             localField: '_id', // The local field to match (email from rwFightLBModel)
        //             foreignField: 'email', // The field from the user collection
        //             as: 'user' // The alias for the joined user document
        //         }
        //     },
        //     {
        //         $unwind: {
        //             path: '$user',
        //             preserveNullAndEmptyArrays: true
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: '$userId',
        //             email: 1,
        //             name: 1,
        //             damage: '$totalDamage',
        //             deathTime: 1,
        //             updateTime: 1,
        //             isVerified: '$user.isVerified', // Include isVerified field from the user collection
        //             isKing: '$user.isKing' // Include isKing field from the user collection
        //         }
        //     }
        // ]);
        // console.log(result,'resultresult');

        return result;
    }

    rw_fightsLBRank(count?: number) {
        return this.rwFightLBModel
            .find({})
            .sort({ dailydamage: -1 })
            .limit(count ?? 5);
    }

    async rw_fightsLBYesterdayRank() {
        const currentDate = new Date();
        const startOfYesterday = new Date(currentDate);
        startOfYesterday.setDate(currentDate.getDate() - 1);
        startOfYesterday.setHours(0, 0, 0, 0);

        const endOfYesterday = new Date(currentDate);
        endOfYesterday.setDate(currentDate.getDate() - 1);
        endOfYesterday.setHours(23, 59, 59, 999);

        const result = await this.rwFightLBModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfYesterday,
                        $lte: endOfYesterday
                    }
                }
            },
            {
                $group: {
                    _id: '$email',
                    totalDamage: { $sum: '$damage' },
                    name: { $first: '$name' },
                    email: { $first: '$email' },
                    userId: { $first: '$_id' },
                    deathTime: { $first: '$deathTime' },
                    updateTime: { $first: '$updateTime' }
                }
            },
            {
                $sort: { totalDamage: -1 }
            },
            {
                $limit: 1
            }
        ]);

        if (result.length > 0) {
            const winner = await this.userService.findOne({
                email: result[0].email
            });
            if (winner) {
                await this.notificationService.create({
                    type: NotificationType.SYSTEM,
                    sender: ENotificationFromType.APP,
                    message:
                        'Congratulation you have rewarded a Daily Fighting with Bronze NFT',
                    // from: userId,
                    receiver: winner._id
                });
            }

            return {
                _id: result[0].userId,
                email: result[0].email,
                name: result[0].name,
                damage: result[0].totalDamage,
                deathTime: result[0].deathTime,
                updateTime: result[0].updateTime
            };
        }

        return null;
    }

    async rw_fightsLBWeeklyRank() {
        const currentDate = new Date();
        const startOfLastWeek = new Date(currentDate);
        startOfLastWeek.setDate(currentDate.getDate() - 7);
        startOfLastWeek.setHours(0, 0, 0, 0);

        const result = await this.rwFightLBModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startOfLastWeek,
                        $lte: currentDate // Use current date as end of range
                    }
                }
            },
            {
                $group: {
                    _id: '$email',
                    totalDamage: { $sum: '$damage' },
                    name: { $first: '$name' },
                    email: { $first: '$email' },
                    userId: { $first: '$_id' },
                    deathTime: { $first: '$deathTime' },
                    updateTime: { $first: '$updateTime' }
                }
            },
            {
                $sort: { totalDamage: -1 }
            },
            {
                $limit: 1
            }
        ]);

        if (result.length > 0) {
            return {
                _id: result[0].userId,
                email: result[0].email,
                name: result[0].name,
                damage: result[0].totalDamage,
                deathTime: result[0].deathTime,
                updateTime: result[0].updateTime
            };
        }

        return null;
    }
}
