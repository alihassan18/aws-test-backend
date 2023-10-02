import { Injectable } from '@nestjs/common';
import { CreateRwCharacterInput } from './dto/create-rw_character.input';
import { UpdateRwCharacterInput } from './dto/update-rw_character.input';
import { InjectModel } from '@nestjs/mongoose';
import {
    RwCharacter,
    RwCharacterDocument
} from './entities/rw_character.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class RwCharacterService {
    constructor(
        @InjectModel(RwCharacter.name)
        private characterModal: Model<RwCharacterDocument>
    ) {}

    create(
        createRwCharacterInput: CreateRwCharacterInput,
        userId: Types.ObjectId
    ) {
        return this.characterModal.create({
            ...createRwCharacterInput,
            user: userId
        });
    }

    findOne(id: Types.ObjectId) {
        return this.characterModal.findOne({ user: id });
    }

    update(id: Types.ObjectId, updateRwCharacterInput: UpdateRwCharacterInput) {
        return this.characterModal.findOneAndUpdate(
            { user: id },
            { $set: { ...updateRwCharacterInput } },
            { new: true }
        );
    }

    remove(id: Types.ObjectId) {
        return this.characterModal.findOneAndDelete({ user: id });
    }
}
