import { Injectable } from '@nestjs/common';
import { UpdateRwSettingInput } from './dto/update-rw_setting.input';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RwSettings, RwSettingsDocument } from './entities/rw_setting.entity';

@Injectable()
export class RwSettingsService {
    constructor(
        @InjectModel(RwSettings.name)
        readonly rwSettingsModel: Model<RwSettingsDocument>
    ) {}
    update(updateRwSettingInput: UpdateRwSettingInput, userId: Types.ObjectId) {
        return this.rwSettingsModel.findOneAndUpdate(
            { user: userId },
            { $set: { ...updateRwSettingInput } },
            { new: true }
        );
    }

    findAll() {
        return `This action returns all rwSettings`;
    }

    async findOne(userId: Types.ObjectId) {
        const settings = await this.rwSettingsModel.findOne({ user: userId });
        if (settings) {
            return settings;
        } else {
            return this.rwSettingsModel.create({ user: userId });
        }
    }
}
