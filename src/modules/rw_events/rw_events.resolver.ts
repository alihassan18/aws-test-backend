import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RwEventsService } from './rw_events.service';
import { RwEvent } from './entities/rw_event.entity';
import { CreateRwEventInput } from './dto/create-rw_event.input';
import { UpdateRwEventInput } from './dto/update-rw_event.input';
import { Types } from 'mongoose';
import { AdminGuard } from '../admin/admin.guard';
import { UseGuards } from '@nestjs/common';
import { Role } from '../admin/role.decorator';

@Resolver(() => RwEvent)
export class RwEventsResolver {
    constructor(private readonly rwEventsService: RwEventsService) {}

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => RwEvent)
    rw_createEvent(
        @Args('createRwEventInput') createRwEventInput: CreateRwEventInput
    ) {
        return this.rwEventsService.create(createRwEventInput);
    }

    @Query(() => [RwEvent])
    rw_events() {
        return this.rwEventsService.findAll();
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => String)
    rw_updateEvent(
        @Args('updateRwEventInput') updateRwEventInput: UpdateRwEventInput
    ) {
        return this.rwEventsService.update(
            updateRwEventInput.id,
            updateRwEventInput
        );
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => String)
    rw_removeEvent(@Args('id', { type: () => String }) id: Types.ObjectId) {
        return this.rwEventsService.remove(id);
    }
}
