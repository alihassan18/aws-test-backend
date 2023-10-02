import { Injectable } from '@nestjs/common';
import { CreateRwUsersMediaInput } from './dto/create-rw_users_media.input';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
    RwUsersMedia,
    RwUsersMediaDocument
} from './entities/rw_users_media.entity';

@Injectable()
export class RwUsersMediaService {
    constructor(
        @InjectModel(RwUsersMedia.name)
        readonly rwUsersMediaModel: Model<RwUsersMediaDocument>
    ) {}
    create(
        createRwUsersMediaInput: CreateRwUsersMediaInput,
        userId: Types.ObjectId
    ) {
        return this.rwUsersMediaModel.create({
            ...createRwUsersMediaInput,
            user: userId
        });
    }

    findAll(id: Types.ObjectId, key?: string) {
        return this.rwUsersMediaModel.find({
            user: id,
            ...(key && { [key]: true })
        });
    }
    findById(id: Types.ObjectId) {
        return this.rwUsersMediaModel.findById(id);
    }

    findOne(id: number) {
        return `This action returns a #${id} rwUsersMedia`;
    }

    favorite(id: Types.ObjectId, status: boolean) {
        return this.rwUsersMediaModel.findByIdAndUpdate(
            id,
            { isFavourite: status },
            { new: true }
        );
    }

    report(id: Types.ObjectId) {
        return this.rwUsersMediaModel.findByIdAndUpdate(
            id,
            { isReport: true },
            { new: true }
        );
    }

    repost(id: Types.ObjectId) {
        return this.rwUsersMediaModel.findByIdAndUpdate(
            id,
            { isRepost: true },
            { new: true }
        );
    }

    async remove(id: Types.ObjectId) {
        await this.rwUsersMediaModel.findByIdAndDelete(id);
        return 'Event Deleted Successfully';
    }
}
