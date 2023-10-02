import { Injectable } from '@nestjs/common';
import { CreateRwRaceLbInput } from './dto/create-rw_race-lb.input';
import { InjectModel } from '@nestjs/mongoose';
import { RwRaceLBDocument, RwRaceLb } from './entities/rw_race-lb.entity';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notifications/notification.service';
import {
    ENotificationFromType,
    NotificationType
} from '../notifications/notifications.enum';

@Injectable()
export class RwRaceLbService {
    constructor(
        @InjectModel(RwRaceLb.name)
        readonly rwReportModel: Model<RwRaceLBDocument>,
        private readonly userService: UsersService,
        private readonly notificationService: NotificationService
    ) {}
    async create(createRwFightLbInput: CreateRwRaceLbInput) {
        // const fight = await this.rwReportModel.findOne({
        //     email: createRwFightLbInput.email
        // });
        // if (fight) {
        //     return this.rwReportModel.findOneAndUpdate(
        //         { email: createRwFightLbInput.email },
        //         { $set: { ...createRwFightLbInput } },
        //         { new: true }
        //     );
        // } else {
        // }
        return this.rwReportModel.create(createRwFightLbInput);
    }

    async findAll(count?: number) {
        const result = await this.rwReportModel.aggregate([
            {
                $group: {
                    _id: '$email',
                    totallaptime: { $sum: '$laptime' },
                    name: { $first: '$name' },
                    email: { $first: '$email' },
                    userId: { $first: '$_id' },
                    updateTime: { $first: '$updateTime' }
                }
            },
            {
                $sort: { totallaptime: 1 }
            },
            {
                $limit: count ? count : 100000000000
            },
            {
                $project: {
                    _id: '$userId',
                    email: 1,
                    name: 1,
                    laptime: '$totallaptime',
                    updateTime: 1
                }
            }
        ]);

        return result;
    }

    async rw_racesLBYesterdayRank() {
        const currentDate = new Date();
        const startOfYesterday = new Date(currentDate);
        startOfYesterday.setDate(currentDate.getDate() - 1);
        startOfYesterday.setHours(0, 0, 0, 0);

        const endOfYesterday = new Date(currentDate);
        endOfYesterday.setDate(currentDate.getDate() - 1);
        endOfYesterday.setHours(23, 59, 59, 999);

        const result = await this.rwReportModel.aggregate([
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
                    totallaptime: { $sum: '$laptime' },
                    name: { $first: '$name' },
                    email: { $first: '$email' },
                    userId: { $first: '$_id' },
                    updateTime: { $first: '$updateTime' }
                }
            },
            {
                $sort: { totallaptime: 1 }
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
                        'Congratulation you have rewarded a Daily Race with Bronze NFT',
                    // from: userId,
                    receiver: winner._id
                });
            }
            return {
                _id: result[0].userId,
                email: result[0].email,
                name: result[0].name,
                laptime: result[0].totallaptime,
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

        const result = await this.rwReportModel.aggregate([
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
                    totallaptime: { $sum: '$laptime' },
                    name: { $first: '$name' },
                    email: { $first: '$email' },
                    userId: { $first: '$_id' },
                    updateTime: { $first: '$updateTime' }
                }
            },
            {
                $sort: { totallaptime: 1 }
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
                laptime: result[0].totallaptime,
                updateTime: result[0].updateTime
            };
        }

        return null;
    }
}
