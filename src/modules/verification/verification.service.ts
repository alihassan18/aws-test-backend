import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    Verification,
    VerificationDocument
} from './entities/verification.entity';

@Injectable()
export class VerificationService {
    constructor(
        @InjectModel(Verification.name)
        private verificationModel: Model<VerificationDocument>
    ) {}

    async createCode(code: number, userId: Types.ObjectId, type?: string) {
        let verification = await this.verificationModel.findOneAndUpdate(
            { userId: userId },
            {
                expiry: new Date().getTime() + 1000 * 60 * 30,
                isVerified: false,
                code: code,
                type: type,
                attempts: 0
            }
        );
        if (!verification) {
            verification = await this.verificationModel.create({
                userId: userId,
                expiry: new Date().getTime() + 1000 * 60 * 30,
                isVerified: false,
                code: code,
                type: type
            });
        }
        return verification;
    }

    async findByUserId(userId: string) {
        const verification = await this.verificationModel.findOne({
            userId: userId
        });
        if (!verification) {
            throw new Error('`Session expired try again.`');
        }
        return verification;
    }
}
