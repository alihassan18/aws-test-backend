import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Score, ScoreDocument } from './entities/score.entity';
import { Model, Types } from 'mongoose';
import { mintstargramScore } from 'src/helpers/common.helpers';
import { MintstargramScoreAction } from 'src/interfaces/common.interface';
import { User, UserDocument } from '../users/entities/user.entity';
import { endOfMonth, startOfMonth } from 'date-fns';
import { HighScoreResult, ScoresResult } from './scores.dto';
import { PublicFeedsGateway } from '../gateways/public/public-feeds.gateway';
import { startOfWeek, endOfDay } from 'date-fns';

@Injectable()
export class ScoresService {
    constructor(
        @InjectModel(Score.name) private scoreModel: Model<ScoreDocument>,
        @InjectModel(User.name) private userModal: Model<UserDocument>, // private userService: UsersService
        @Inject(forwardRef(() => PublicFeedsGateway))
        private publicFeedsGateway: PublicFeedsGateway
    ) {}

    async createScore(
        userId: Types.ObjectId,
        action: MintstargramScoreAction
    ): Promise<void> {
        try {
            let score = mintstargramScore(action);
            const random = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
            score = Number(score + '.' + '0' + random);

            const isAlready = await this.userModal.findOne({ points: score });
            if (isAlready) {
                if (await this.userModal.findOne({ points: score })) {
                    score = Number(score + '.' + '0' + random + random);
                }
            }

            await this.userModal
                .findByIdAndUpdate(userId, {
                    $inc: { points: score }
                })
                .exec();

            await this.scoreModel.create({
                user: userId,
                action: action,
                score: score,
                createdAt: new Date()
            });

            this.publicFeedsGateway.emitTopScorersData(
                await this.getMonthTopScores()
            );
        } catch (error) {
            console.log(error, 'error in create score');
        }
    }

    // async getMonthTopScores(): Promise<ScoresResult[]> {
    //     return await this.scoreModel
    //         .aggregate([
    //             {
    //                 $match: {
    //                     createdAt: {
    //                         $lte: endOfMonth(new Date()),
    //                         $gte: startOfMonth(new Date())
    //                     }
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: 'users',
    //                     localField: 'user',
    //                     foreignField: '_id',
    //                     as: 'user'
    //                 }
    //             },
    //             {
    //                 $unwind: '$user'
    //             },
    //             {
    //                 $group: {
    //                     _id: '$user._id',
    //                     monthScore: { $sum: '$score' },
    //                     user: {
    //                         $first: {
    //                             _id: '$user._id',
    //                             userName: '$user.userName',
    //                             points: '$user.points',
    //                             lastName: '$user.lastName',
    //                             followersCount: '$user.followersCount',
    //                             firstName: '$user.firstName',
    //                             avatar: '$user.avatar',
    //                             isVerified: '$user.isVerified',
    //                             isSCC: '$user.isSCC'
    //                         }
    //                     }
    //                 }
    //             },
    //             {
    //                 $setWindowFields: {
    //                     sortBy: { monthScore: -1 },
    //                     output: {
    //                         rank: {
    //                             $rank: {}
    //                         }
    //                     }
    //                 }
    //             },
    //             {
    //                 $limit: 100
    //             }
    //         ])
    //         .exec();
    // }

    async getMonthTopScores(): Promise<ScoresResult[]> {
        const startOfMonthDate = startOfMonth(new Date());
        const endOfMonthDate = endOfMonth(new Date());

        // const startOfLastWeek = startOfWeek(addDays(new Date(), -7));
        // const endOfLastWeek = endOfWeek(addDays(new Date(), -7));
        const startOfWeekDate = startOfWeek(new Date());
        const endOfToday = endOfDay(new Date());

        const res = await this.scoreModel
            .aggregate([
                {
                    $match: {
                        $or: [
                            {
                                createdAt: {
                                    $gte: startOfMonthDate,
                                    $lte: endOfMonthDate
                                }
                            },
                            {
                                createdAt: {
                                    $gte: startOfWeekDate,
                                    $lte: endOfToday
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $group: {
                        _id: '$user._id',
                        user: {
                            $first: {
                                _id: '$user._id',
                                userName: '$user.userName',
                                points: '$user.points',
                                lastName: '$user.lastName',
                                followersCount: '$user.followersCount',
                                firstName: '$user.firstName',
                                avatar: '$user.avatar',
                                isVerified: '$user.isVerified',
                                isSCC: '$user.isSCC'
                            }
                        },
                        monthScore: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $and: [
                                            {
                                                $gte: [
                                                    '$createdAt',
                                                    startOfMonthDate
                                                ]
                                            },
                                            {
                                                $lte: [
                                                    '$createdAt',
                                                    endOfMonthDate
                                                ]
                                            }
                                        ]
                                    },
                                    then: '$score',
                                    else: 0
                                }
                            }
                        },
                        weekScore: {
                            $sum: {
                                $cond: {
                                    if: {
                                        $and: [
                                            {
                                                $gte: [
                                                    '$createdAt',
                                                    startOfWeekDate
                                                ]
                                            },
                                            {
                                                $lte: ['$createdAt', endOfToday]
                                            }
                                        ]
                                    },
                                    then: '$score',
                                    else: 0
                                }
                            }
                        }
                    }
                },
                {
                    $setWindowFields: {
                        sortBy: { weekScore: -1 },
                        output: {
                            rank: {
                                $rank: {}
                            }
                        }
                    }
                },
                {
                    $limit: 100
                }
            ])
            .exec();
        return res;
    }

    async getMonthScores(): Promise<ScoresResult[]> {
        return await this.scoreModel
            .aggregate([
                {
                    $match: {
                        createdAt: {
                            $lte: endOfMonth(new Date()),
                            $gte: startOfMonth(new Date())
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $group: {
                        _id: '$user._id',
                        monthScore: { $sum: '$score' }
                    }
                },
                {
                    $setWindowFields: {
                        sortBy: { monthScore: -1 },
                        output: {
                            rank: {
                                $rank: {}
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                { $skip: 100 }
            ])
            .exec();
    }

    // --------- for single user

    async getUserMonthScore(userId: Types.ObjectId): Promise<ScoresResult> {
        const score = await this.scoreModel
            .aggregate([
                {
                    $match: {
                        createdAt: {
                            $lte: endOfMonth(new Date()),
                            $gte: startOfMonth(new Date())
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $group: {
                        _id: '$user._id',
                        monthScore: { $sum: '$score' }
                    }
                },
                {
                    $setWindowFields: {
                        sortBy: { monthScore: -1 },
                        output: {
                            rank: {
                                $rank: {}
                            }
                        }
                    }
                },
                {
                    $match: { _id: userId }
                },
                {
                    $unwind: '$_id'
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                }
            ])
            .exec();
        return score[0];
    }

    // ----- Highest Score --------------

    async highestScore(): Promise<HighScoreResult> {
        const user = await this.userModal
            .findOne({}, null, {
                sort: { points: -1 }
            })
            .exec();
        if (!user) {
            return null;
        }
        return {
            userId: user._id,
            score: user.points
        };
    }
}
