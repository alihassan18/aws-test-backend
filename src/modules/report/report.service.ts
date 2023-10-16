import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Report, ReportDocument } from './report.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ReportStatus } from './report.enums';
import { NotificationService } from '../notifications/notification.service';
import {
    ENotificationFromType,
    NotificationType
} from '../notifications/notifications.enum';
import { CreateReportDto } from './report.dto';

@Injectable()
export class ReportService {
    constructor(
        @InjectModel(Report.name) private reportModal: Model<ReportDocument>,
        private readonly notificationService: NotificationService
    ) {}

    async create(
        data: CreateReportDto,
        reportBy: Types.ObjectId
    ): Promise<ReportDocument> {
        // try {
        if (
            !data?.user &&
            !data?.post &&
            !data?.nft &&
            !data?.land &&
            !data?._collection
        ) {
            throw new Error(
                'You should need to pass post/user/nft/land/collection'
            );
        }
        if (data?.post) {
            const alreadyReported = await this.reportModal.findOne({
                post: new Types.ObjectId(data?.post),
                reportedBy: reportBy
            });

            if (alreadyReported) {
                throw new Error('You have already reported this post');
            }
        }

        if (data?.user) {
            const alreadyReported = await this.reportModal.findOne({
                user: new Types.ObjectId(data?.user),
                reportedBy: reportBy
            });

            if (alreadyReported) {
                throw new Error('You have already reported this user');
            }
        }

        if (data?.nft) {
            const alreadyReported = await this.reportModal.findOne({
                // nft: new Types.ObjectId(data?.nft),
                nft: data?.nft,
                reportedBy: reportBy
            });

            if (alreadyReported) {
                throw new Error('You have already reported this nft');
            }
        }

        if (data?.land) {
            const alreadyReported = await this.reportModal.findOne({
                land: new Types.ObjectId(data?.land),
                reportedBy: reportBy
            });

            if (alreadyReported) {
                throw new Error('You have already reported this land');
            }
        }

        if (data?._collection) {
            // const alreadyReported = await this.reportModal.findOne({
            //     _collection: new Types.ObjectId(data?._collection),
            //     reportedBy: reportBy
            // });
            const alreadyReported = await this.reportModal.findOne({
                _collection: data?._collection,
                reportedBy: reportBy
            });

            console.log({ alreadyReported }, data?._collection?.contract);

            if (alreadyReported) {
                throw new Error('You have already reported this collection');
            }
        }

        const newReport = await new this.reportModal({
            ...data,
            ...(data.post && { post: new Types.ObjectId(data.post) }),
            ...(data.user && { user: new Types.ObjectId(data.user) }),
            // ...(data.nft && { nft: new Types.ObjectId(data.nft) }),
            ...(data.nft && { nft: data.nft }),
            ...(data.land && { land: new Types.ObjectId(data.land) }),
            // ...(data._collection && {
            //     _collection: new Types.ObjectId(data._collection)
            // }),
            ...(data._collection && {
                _collection: data._collection
            }),
            reportedBy: reportBy
        });

        this.notificationService.create({
            type: NotificationType.SYSTEM,
            sender: ENotificationFromType.APP,
            message: 'We have received your report',
            receiver: reportBy
        });
        return newReport.save();
        // } catch (error:unknown) {
        //     throw new Error(error?.message);
        // }

        // return await this.reportModal.create({
        //     ...data,
        //     ...(data.post && { post: new Types.ObjectId(data.post) }),
        //     ...(data.user && { user: new Types.ObjectId(data.user) }),
        //     reportedBy: reportBy
        // });
    }

    async getUsersReports(): Promise<ReportDocument[]> {
        return this.reportModal
            .find({
                type: { $ne: ReportStatus.COMPLETED },
                user: { $exists: true, $ne: null }
            })
            .sort({ _id: -1 });
    }

    async getPostReports(): Promise<ReportDocument[]> {
        return this.reportModal
            .find({
                type: { $ne: ReportStatus.COMPLETED },
                post: { $exists: true, $ne: null }
            })
            .sort({ _id: -1 });
    }

    async getNftsReports(): Promise<ReportDocument[]> {
        return this.reportModal
            .find({
                type: { $ne: ReportStatus.COMPLETED },
                nft: { $exists: true, $ne: null }
            })
            .sort({ _id: -1 });
    }

    async getCollectionsReports(): Promise<ReportDocument[]> {
        return this.reportModal
            .find({
                type: { $ne: ReportStatus.COMPLETED },
                _collection: { $exists: true, $ne: null }
            })
            .sort({ _id: -1 });
    }

    async getlandsReports(): Promise<ReportDocument[]> {
        return this.reportModal
            .find({
                type: { $ne: ReportStatus.COMPLETED },
                land: { $exists: true, $ne: null }
            })
            .sort({ _id: -1 });
    }

    async resolveReport(id: Types.ObjectId) {
        await this.reportModal.findByIdAndUpdate(id, {
            type: ReportStatus.COMPLETED
        });

        return { success: true };
    }

    async blockReportedCollection(id: Types.ObjectId) {
        await this.reportModal.findByIdAndUpdate(id, {
            type: ReportStatus.COMPLETED,
            '_collection.isBlocked': true
        });

        return { success: true };
    }

    async blockReportedNft(id: Types.ObjectId) {
        await this.reportModal.findByIdAndUpdate(id, {
            type: ReportStatus.COMPLETED,
            'nft.isBlocked': true
        });

        return { success: true };
    }

    async isNFTBlocked(contract: string, chain: string, tokenId: string) {
        const isAvailable = await this.reportModal.findOne({
            type: ReportStatus.COMPLETED,
            $and: [
                { 'nft.contract': contract },
                { 'nft.chain': chain },
                { 'nft.tokenId': tokenId },
                { 'nft.isBlocked': true }
            ]
        });
        if (isAvailable) {
            return { success: true };
        } else {
            return { success: false };
        }
    }

    async isCollectionBlocked(contract: string, chain: string) {
        const isAvailable = await this.reportModal.findOne({
            type: ReportStatus.COMPLETED,
            $and: [
                {
                    '_collection.contract': {
                        $regex: new RegExp(`${contract}`, 'i')
                    }
                },
                { '_collection.chain': chain },
                { '_collection.isBlocked': true }
            ]
        });
        if (isAvailable) {
            return { success: true };
        } else {
            return { success: false };
        }
    }

    // async getAllReportedListing(
    //     page: number,
    //     resPerPage: number,
    //     search: string,
    //     type: string,
    //     active: boolean
    // ): Promise<ReportDocument[]> {
    //     try {
    //         // const query = [];
    //         // if (search) query.push({name: { $regex: search, $options: 'i' }});

    //         const [listing, listingCount] = await Promise.all([
    //             this.reportModal
    //                 .find({ status: active, type: type })
    //                 .populate({
    //                     path: 'reportedBy',
    //                     select: 'firstName lastName userName email isVerified'
    //                 })
    //                 .populate({
    //                     path: 'user',
    //                     select: 'firstName lastName userName email isVerified'
    //                 })
    //                 .populate({
    //                     path: 'listing',
    //                     populate: 'nft'
    //                 })
    //                 .populate({
    //                     path: 'feed',
    //                     populate: [
    //                         {
    //                             path: 'nft',
    //                             populate: 'nft'
    //                         },
    //                         {
    //                             path: 'user',
    //                             select: '  firstName lastName userName  email'
    //                         }
    //                     ]
    //                 })
    //                 .populate({
    //                     path: 'comment',
    //                     populate: [
    //                         {
    //                             path: 'nft',
    //                             select: 'tokenId'
    //                         },
    //                         {
    //                             path: 'feed',
    //                             select: '_id'
    //                         },
    //                         {
    //                             path: 'user',
    //                             select: '  firstName lastName userName  email'
    //                         },
    //                         {
    //                             path: 'comment',
    //                             populate: [
    //                                 {
    //                                     path: 'nft',
    //                                     select: 'tokenId'
    //                                 },
    //                                 {
    //                                     path: 'feed',
    //                                     select: '_id'
    //                                 },
    //                                 {
    //                                     path: 'comment',
    //                                     populate: [
    //                                         {
    //                                             path: 'nft',
    //                                             select: 'tokenId'
    //                                         },
    //                                         {
    //                                             path: 'feed',
    //                                             select: '_id'
    //                                         }
    //                                     ]
    //                                 }
    //                             ]
    //                         }
    //                     ]
    //                 })
    //                 .sort({ createdAt: -1 })
    //                 .skip(resPerPage * page - resPerPage)
    //                 .limit(resPerPage),

    //             this.reportModal.find({ status: active }).count()
    //         ]);

    //         return {
    //             listing: listing,
    //             current_page: page,
    //             pages: Math.ceil(listingCount / resPerPage),
    //             total_listing: listingCount,
    //             per_page: resPerPage
    //         };
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    // async blockReportedListing(listingId: string) {
    //     const report = await this.reportModal.findByIdAndUpdate(listingId, {
    //         status: false
    //     });
    //     const updateList = await this.listingRepository.findByIdAndUpdate(
    //         report.listing,
    //         { isBlocked: true }
    //     );
    //     return report;
    // }

    // async blockPost(reportId: string) {
    //     try {
    //         const report = await this.reportModal.findByIdAndUpdate(reportId, {
    //             status: false
    //         });
    //         const feed = await this.feedRepository.findByIdAndUpdate(
    //             report.feed,
    //             {
    //                 active: false
    //             }
    //         );
    //         await this.deleteUserAccount(feed?.user);
    //         return report;
    //     } catch (err) {
    //         return err;
    //     }
    // }

    // async blockComment(reportId: string) {
    //     try {
    //         const report = await this.reportModal.findByIdAndUpdate(reportId, {
    //             status: false
    //         });
    //         const feed = await this.commentRepository.findByIdAndUpdate(
    //             report.comment,
    //             {
    //                 active: false
    //             }
    //         );
    //         await this.deleteUserAccount(feed?.user);
    //         return report;
    //     } catch (err) {
    //         return err;
    //     }
    // }

    // async blockUser(reportId: string) {
    //     try {
    //         const report = await this.reportModal.findByIdAndUpdate(reportId, {
    //             status: false
    //         });
    //         const User = await this.userRepository.findByIdAndUpdate(
    //             report.user,
    //             {
    //                 isDeleted: true,
    //                 deletedAt: new Date(),
    //                 isBlocked: true,
    //                 email: 'deleted',
    //                 userName: 'deleted'
    //             }
    //         );
    //         return report;
    //     } catch (err) {
    //         return err;
    //     }
    // }

    // async deleteUserAccount(id: any) {
    //     return this.userRepository.findByIdAndUpdate(id, {
    //         isDeleted: true,
    //         deletedAt: new Date(),
    //         isBlocked: true,
    //         email: 'deleted',
    //         userName: 'deleted'
    //     });
    // }
}
