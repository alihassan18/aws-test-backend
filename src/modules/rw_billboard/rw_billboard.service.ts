import { Injectable } from '@nestjs/common';
import { CreateRwBillboardInput } from './dto/create-rw_billboard.input';
import { InjectModel } from '@nestjs/mongoose';
import {
    RwBillBoard,
    RwBillBoardDocument
} from './entities/rw_billboard.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class RwBillBoardService {
    constructor(
        @InjectModel(RwBillBoard.name)
        readonly rwBillBoard: Model<RwBillBoardDocument>
    ) {}
    async create(CreateRwBillboardInput: CreateRwBillboardInput) {
        const isPresent = await this.rwBillBoard.findOne({
            _id: CreateRwBillboardInput.id
        });

        if (!isPresent) {
            const results = await this.rwBillBoard.create(
                CreateRwBillboardInput
            );
            return results;
        } else {
            const results = await this.rwBillBoard.findByIdAndUpdate(
                { _id: CreateRwBillboardInput.id },
                { $set: { ...CreateRwBillboardInput } },
                { new: true }
            );
            return results;
        }
    }

    findAll() {
        return this.rwBillBoard.find({});
    }

    findOne(id: Types.ObjectId) {
        return this.rwBillBoard.findById(id);
    }

    findOneByLocation(location: string) {
        return this.rwBillBoard.findOne({
            location: new RegExp(`${location}`, 'i')
        });
    }

    remove(id: Types.ObjectId) {
        return this.rwBillBoard.findByIdAndDelete(id);
    }
}
