import { Injectable } from '@nestjs/common';
import {
    CreateRwBuildingInput,
    CreateRwBuildingTypesInput
} from './dto/create-rw_building.input';
import { UpdateRwBuildingInput } from './dto/update-rw_building.input';
import { InjectModel } from '@nestjs/mongoose';
import { RwBuilding, RwBuildingDocument } from './entities/rw_building.entity';
import { Model, Types } from 'mongoose';
import {
    RwBuildingTypes,
    RwBuildingTypesDocument
} from './entities/rw_buildingTypes.entity';

@Injectable()
export class RwBuildingsService {
    constructor(
        @InjectModel(RwBuilding.name)
        readonly rwBuildingModel: Model<RwBuildingDocument>,
        @InjectModel(RwBuildingTypes.name)
        readonly rwBuildingTypesModel: Model<RwBuildingTypesDocument>
    ) {}
    async create(createRwBuildingInput: CreateRwBuildingInput) {
        const newBuilding = await this.rwBuildingModel.create(
            createRwBuildingInput
        );

        const buildType = await this.rwBuildingTypesModel.findOne({
            index: createRwBuildingInput.ubindex
        });
        if (buildType) {
            buildType.assigned = true;
            await buildType.save();
        }
        return newBuilding;
    }

    async findAll(title?: string) {
        let buildings;
        if (title) {
            buildings = await this.rwBuildingModel
                .find({ title: title })
                .lean();
        } else {
            buildings = await this.rwBuildingModel.find({}).lean();
        }
        return JSON.stringify({ items: buildings });
    }

    async update(
        id: Types.ObjectId,
        updateRwBuildingInput: UpdateRwBuildingInput
    ) {
        return this.rwBuildingModel.findByIdAndUpdate(
            { _id: id },
            { $set: { ...updateRwBuildingInput } },
            { new: true }
        );
    }

    async remove(id: Types.ObjectId, bIndex: string) {
        await this.rwBuildingModel.deleteOne({ _id: id });
        const buildType = await this.rwBuildingTypesModel.findOne({
            index: bIndex
        });
        if (buildType) {
            buildType.assigned = false;
            await buildType.save();
        }

        return `Building Removed Successfully`;
    }

    // ------------ BUILDING TYPES ------------

    async rw_buildingsTypes() {
        const buildings = await this.rwBuildingTypesModel.find({});
        return JSON.stringify({ items: buildings });
    }

    async rw_buildingsCreate(
        createRwBuildingTypesInput: CreateRwBuildingTypesInput
    ) {
        const building = await this.rwBuildingTypesModel.findOne({
            index: createRwBuildingTypesInput.index
        });
        if (building) {
            return this.rwBuildingTypesModel.findOneAndUpdate(
                { index: createRwBuildingTypesInput.index },
                { $set: { ...createRwBuildingTypesInput } },
                { new: true }
            );
        } else {
            return this.rwBuildingTypesModel.create(createRwBuildingTypesInput);
        }
    }
}
