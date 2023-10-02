import { Injectable } from '@nestjs/common';
import { CreateReferralVideoInput } from './dto/create-referral-video.input';
import { InjectModel } from '@nestjs/mongoose';
import {
    ReferralVideo,
    ReferralVideoDocument
} from './entities/referral-video.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class ReferralVideoService {
    constructor(
        @InjectModel(ReferralVideo.name)
        readonly referralVideoModel: Model<ReferralVideoDocument>
    ) {}
    create(createReferralVideoInput: CreateReferralVideoInput) {
        return this.referralVideoModel.create(createReferralVideoInput);
    }

    findAll() {
        return this.referralVideoModel.find({});
    }

    findOne(id: number) {
        return `This action returns a #${id} referralVideo`;
    }

    async findOneAndUpdate(
        clause: {
            [key: string]: unknown;
        },
        data
    ): Promise<ReferralVideoDocument | undefined> {
        const results = await this.referralVideoModel
            .findOneAndUpdate(clause, data, {
                new: true
            })
            .exec();
        return results;
    }

    remove(id: Types.ObjectId) {
        return this.referralVideoModel.findByIdAndDelete(id);
    }
}
