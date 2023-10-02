import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RwTutorialsService } from './rw_tutorials.service';
import { RwTutorials } from './entities/rw_tutorials.entity';
import { CreateRwTutorialsInput } from './dto/create-rw_tutorials.input';
import { UpdateRwTutorialsInput } from './dto/update-rw_tutorials.input';
import { Types } from 'mongoose';
import { AdminGuard } from '../admin/admin.guard';
import { UseGuards } from '@nestjs/common';
import { Role } from '../admin/role.decorator';

@Resolver(() => RwTutorials)
export class RwTutorialsResolver {
    constructor(private readonly rwTutorialsService: RwTutorialsService) {}

    @Mutation(() => RwTutorials)
    @UseGuards(AdminGuard)
    @Role('admin')
    rw_createTutorial(
        @Args('createRwTutorialsInput')
        createRwTutorialsInput: CreateRwTutorialsInput
    ) {
        return this.rwTutorialsService.create(createRwTutorialsInput);
    }

    @Query(() => String)
    rw_tutorials() {
        return this.rwTutorialsService.findAll();
    }

    @Mutation(() => String)
    @UseGuards(AdminGuard)
    @Role('admin')
    rw_updateTutorial(
        @Args('updateRwTutorialsInput')
        updateRwTutorialsInput: UpdateRwTutorialsInput
    ) {
        return this.rwTutorialsService.update(
            updateRwTutorialsInput.id,
            updateRwTutorialsInput
        );
    }

    @Mutation(() => String)
    @UseGuards(AdminGuard)
    @Role('admin')
    rw_removeTutorial(@Args('id', { type: () => String }) id: Types.ObjectId) {
        return this.rwTutorialsService.remove(id);
    }
}
