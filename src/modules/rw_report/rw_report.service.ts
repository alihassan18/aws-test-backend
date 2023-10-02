import { Injectable } from '@nestjs/common';
import { CreateRwReportInput } from './dto/create-rw_report.input';
import { InjectModel } from '@nestjs/mongoose';
import { RwReport, RwReportDocument } from './entities/rw_report.entity';
import { Model, Types } from 'mongoose';
import {
    RwUsersMedia,
    RwUsersMediaDocument
} from '../rw_users_media/entities/rw_users_media.entity';

@Injectable()
export class RwReportService {
    constructor(
        @InjectModel(RwReport.name)
        readonly rwReportModel: Model<RwReportDocument>,
        @InjectModel(RwUsersMedia.name)
        readonly rwUMediaModel: Model<RwUsersMediaDocument>
    ) {}

    async create(
        createRwReportInput: CreateRwReportInput,
        userId: Types.ObjectId
    ) {
        if (createRwReportInput.mediaId) {
            await this.rwUMediaModel.findByIdAndUpdate(
                createRwReportInput.mediaId,
                { isReport: true }
            );
        }
        return this.rwReportModel.create({
            ...createRwReportInput,
            reporter: userId
        });
    }

    findAll() {
        return this.rwReportModel.find({});
    }

    usersReports(id: Types.ObjectId) {
        return this.rwReportModel.find({ reporter: id });
    }

    remove(id: Types.ObjectId) {
        return this.rwReportModel.findByIdAndUpdate(
            id,
            { resolved: true },
            { new: true }
        );
    }
}
