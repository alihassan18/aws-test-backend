import { Injectable } from '@nestjs/common';
import { CreateRwTutorialsInput } from './dto/create-rw_tutorials.input';
import { UpdateRwTutorialsInput } from './dto/update-rw_tutorials.input';
import { InjectModel } from '@nestjs/mongoose';
import {
    RwTutorials,
    RwTutorialsDocument
} from './entities/rw_tutorials.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class RwTutorialsService {
    constructor(
        @InjectModel(RwTutorials.name)
        readonly rwTutorialsModel: Model<RwTutorialsDocument>
    ) {}
    create(createRwTutorialsInput: CreateRwTutorialsInput) {
        return this.rwTutorialsModel.create(createRwTutorialsInput);
    }
    s;
    async findAll() {
        const tutorials = await this.rwTutorialsModel.find({});
        return JSON.stringify(tutorials);
    }

    async update(
        id: Types.ObjectId,
        updateRwTutorialsInput: UpdateRwTutorialsInput
    ) {
        const update = await this.rwTutorialsModel.findByIdAndUpdate(
            { _id: id },
            { $set: { ...updateRwTutorialsInput } },
            { new: true }
        );
        return JSON.stringify(update);
    }

    async remove(id: Types.ObjectId) {
        await this.rwTutorialsModel.findByIdAndDelete(id);
        return 'Tutorial Deleted Successfully';
    }
}
