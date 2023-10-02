import { Injectable } from '@nestjs/common';
import { CreateRwLandInput } from './dto/create-rw_land.input';
import { InjectModel } from '@nestjs/mongoose';
import { RwLand, RwLandDocument } from './entities/rw_land.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class RwLandService {
    constructor(
        @InjectModel(RwLand.name) readonly rwLandModel: Model<RwLandDocument>
    ) {}
    async create(createRwLandInput: CreateRwLandInput) {
        const isPresent = await this.rwLandModel.findOne({
            LandID: createRwLandInput.LandID
        });
        const payload = {
            ...createRwLandInput,
            Data: JSON.stringify(createRwLandInput.Data)
        };

        if (!isPresent) {
            const results = await this.rwLandModel.create(payload);
            return results;
        } else {
            const results = await this.rwLandModel.findOneAndUpdate(
                { LandID: createRwLandInput.LandID },
                { $set: { ...payload } },
                { new: true }
            );
            return results;
        }
    }

    async findAll() {
        const query = {};
        // if (search) {
        //   let regQ = new RegExp(search, 'i')
        //   query['$or'] = [{ LandID: regQ }]
        // }
        const results = await this.rwLandModel
            .find({ ...query })
            .sort({ _id: -1 });

        return JSON.stringify({ items: results });
    }

    async findOne(id: string) {
        const land = await this.rwLandModel.findOne({ LandID: id });
        if (land) {
            return land;
        } else {
            throw new Error('This land id does not exist');
        }
    }

    remove(id: Types.ObjectId) {
        return this.rwLandModel.findOneAndDelete({ LandID: id });
    }
}
