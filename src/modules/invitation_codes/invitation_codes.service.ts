import { Injectable } from '@nestjs/common';
import { CreateInvitationCodeInput } from './dto/create-invitation_code.input';
import {
    InvitationCode,
    InvitationCodeDocument
} from './entities/invitation_code.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EmailService } from '../shared/services/email.service';

@Injectable()
export class InvitationCodesService {
    constructor(
        @InjectModel(InvitationCode.name)
        readonly invitationCodeModel: Model<InvitationCodeDocument>,
        readonly emailService: EmailService
    ) {}
    async create(
        createInvitationCodeInput: CreateInvitationCodeInput,
        user: Types.ObjectId,
        userName: string
    ) {
        const isPresent = await this.invitationCodeModel.findOne({
            user,
            invitedUser: createInvitationCodeInput.email
        });
        await this.emailService.sendMintstargramInvite(
            createInvitationCodeInput.email,
            userName,
            createInvitationCodeInput.code
        );
        if (isPresent) {
            return this.invitationCodeModel.findOneAndUpdate(
                { user, email: createInvitationCodeInput.email },
                { code: createInvitationCodeInput.code },
                { new: true }
            );
        } else {
            return this.invitationCodeModel.create({
                ...createInvitationCodeInput,
                user
            });
        }
    }

    findAll() {
        return `This action returns all invitationCodes`;
    }

    findOne(id: number) {
        return `This action returns a #${id} invitationCode`;
    }

    update(id: number) {
        return `This action updates a #${id} invitationCode`;
    }

    remove(id: number) {
        return `This action removes a #${id} invitationCode`;
    }
}
