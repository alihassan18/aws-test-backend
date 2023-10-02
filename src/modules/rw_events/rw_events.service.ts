import { Injectable } from '@nestjs/common';
import { CreateRwEventInput } from './dto/create-rw_event.input';
import { UpdateRwEventInput } from './dto/update-rw_event.input';
import { InjectModel } from '@nestjs/mongoose';
import { RwEvent, RwEventDocument } from './entities/rw_event.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class RwEventsService {
    constructor(
        @InjectModel(RwEvent.name) readonly rwEventModel: Model<RwEventDocument>
    ) {}
    create(createRwEventInput: CreateRwEventInput) {
        return this.rwEventModel.create(createRwEventInput);
    }

    async findAll() {
        const eventsAll = await this.rwEventModel.find({}).lean();
        const events = [];
        for (const ev of eventsAll) {
            const currentDate = new Date();
            const timeDifference =
                ev.start_date.getTime() - currentDate.getTime();
            const remainingDays = Math.ceil(
                timeDifference / (1000 * 3600 * 24)
            );
            events.push({ ...ev, Remaining_Days: remainingDays });
        }

        return events;
    }

    async update(id: Types.ObjectId, updateRwEventInput: UpdateRwEventInput) {
        const update = await this.rwEventModel.findByIdAndUpdate(
            { _id: id },
            { $set: { ...updateRwEventInput } },
            { new: true }
        );
        return JSON.stringify(update);
    }

    async remove(id: Types.ObjectId) {
        await this.rwEventModel.findByIdAndDelete(id);
        return 'Event Deleted Successfully';
    }
}
