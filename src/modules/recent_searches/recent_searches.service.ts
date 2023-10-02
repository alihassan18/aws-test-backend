import { Injectable } from '@nestjs/common';
import { CreateRecentSearchInput } from './dto/create-recent_search.input';
import { UpdateRecentSearchInput } from './dto/update-recent_search.input';
import { InjectModel } from '@nestjs/mongoose';
import {
    RecentSearch,
    RecentSearchDocument
} from './entities/recent_search.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class RecentSearchesService {
    constructor(
        @InjectModel(RecentSearch.name)
        private search: Model<RecentSearchDocument>
    ) {}

    async create(
        characterModal: CreateRecentSearchInput,
        userId: Types.ObjectId
    ) {
        const payload = {
            user: userId,
            ...(characterModal.hashtag && {
                hashtag: characterModal.hashtag
            }),
            ...(characterModal._collection && {
                _collection: new Types.ObjectId(characterModal._collection)
            }),
            ...(characterModal.userToSearch && {
                userToSearch: new Types.ObjectId(characterModal.userToSearch)
            })
        };
        const isAlready = await this.search.findOne(payload);
        if (isAlready) {
            return isAlready;
        } else {
            return this.search.create(payload);
        }
    }

    findAll(userId: Types.ObjectId) {
        return this.search.find({ user: userId });
    }

    findOne(id: number) {
        return `This action returns a #${id} recentSearch`;
    }

    update(id: number, updateRecentSearchInput: UpdateRecentSearchInput) {
        return `This action updates a #${id} recentSearch ${updateRecentSearchInput}`;
    }

    remove(id: string) {
        return this.search.deleteOne({ _id: id });
    }

    removeAll(id: string) {
        return this.search.deleteMany({ user: id });
    }
}
