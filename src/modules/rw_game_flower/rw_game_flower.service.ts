import { Injectable } from '@nestjs/common';
import { CreateRwGameFlowerInput } from './dto/create-rw_game_flower.input';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
    RwGameFlower,
    RwGameFlowerDocument
} from './entities/rw_game_flower.entity';
import { getGameFlowerOpenTime } from 'src/helpers/common.helpers';

@Injectable()
export class RwGameFlowerService {
    constructor(
        @InjectModel(RwGameFlower.name)
        private rwFlowerModel: Model<RwGameFlowerDocument>
    ) {}

    async create(
        createRwGameFlowerInput: CreateRwGameFlowerInput,
        _userId: Types.ObjectId
    ) {
        const isPresent = await this.rwFlowerModel.findOne({
            user: _userId
        });

        if (!isPresent) {
            return this.rwFlowerModel.create({
                ...createRwGameFlowerInput,
                user: _userId,
                openAt: getGameFlowerOpenTime(new Date())
            });
        } else {
            const currentTime = new Date();
            // const openTime = getGameFlowerOpenTime(new Date(isPresent.openAt));
            const openTime = isPresent.openAt;

            if (createRwGameFlowerInput.isDaily && openTime > currentTime) {
                throw new Error(
                    'You claimed already 1 Flower. Please come after 20 UTC'
                );
            }
            const results = await this.rwFlowerModel.findOneAndUpdate(
                { user: _userId },
                {
                    $set: {
                        ...createRwGameFlowerInput,
                        ...(createRwGameFlowerInput.isDaily && {
                            openAt: getGameFlowerOpenTime(new Date())
                        })
                    }
                },
                { new: true }
            );

            return results;
        }
    }

    findAll() {
        return `This action returns all rwGameFlower`;
    }

    findOne(id: Types.ObjectId) {
        return this.rwFlowerModel.findOne({ user: id });
    }

    remove(id: Types.ObjectId) {
        return this.rwFlowerModel.findOne({ user: id });
    }
}
