import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RwBuildingsService } from './rw_buildings.service';
import { RwBuilding } from './entities/rw_building.entity';
import {
    CreateRwBuildingInput,
    CreateRwBuildingTypesInput
} from './dto/create-rw_building.input';
import { UpdateRwBuildingInput } from './dto/update-rw_building.input';
import { Types } from 'mongoose';
import { AdminGuard } from '../admin/admin.guard';
import { UseGuards } from '@nestjs/common';
import { Role } from '../admin/role.decorator';
import { RwBuildingTypes } from './entities/rw_buildingTypes.entity';

@Resolver(() => RwBuilding)
export class RwBuildingsResolver {
    constructor(private readonly rwBuildingsService: RwBuildingsService) {}

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => RwBuilding)
    rw_buildingCreate(
        @Args('createRwBuildingInput')
        createRwBuildingInput: CreateRwBuildingInput
    ) {
        return this.rwBuildingsService.create(createRwBuildingInput);
    }

    @Query(() => String)
    rw_buildings(
        @Args('title', { nullable: true })
        title: string
    ) {
        return this.rwBuildingsService.findAll(title);
    }

    // @Query(() => RwBuilding, { name: 'rwBuilding' })
    // findOne(@Args('id', { type: () => Int }) id: number) {
    //     return this.rwBuildingsService.findOne(id);
    // }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => RwBuilding)
    rw_buildingUpdate(
        @Args('updateRwBuildingInput')
        updateRwBuildingInput: UpdateRwBuildingInput
    ) {
        return this.rwBuildingsService.update(
            updateRwBuildingInput.id,
            updateRwBuildingInput
        );
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => String)
    rw_buildingRemove(
        @Args('id', { type: () => String }) id: Types.ObjectId,
        @Args('bIndex', { type: () => String }) bIndex: string
    ) {
        return this.rwBuildingsService.remove(id, bIndex);
    }

    // ------------ BUILDING TYPES ------------

    @Query(() => String)
    rw_buildingTypes() {
        return this.rwBuildingsService.rw_buildingsTypes();
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => RwBuildingTypes)
    rw_buildingTypeCreate(
        @Args('createRwBuildingTypesInput')
        createRwBuildingTypesInput: CreateRwBuildingTypesInput
    ) {
        return this.rwBuildingsService.rw_buildingsCreate(
            createRwBuildingTypesInput
        );
    }
}
