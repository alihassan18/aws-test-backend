import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { RwBillBoardService } from './rw_billboard.service';
import { RwBillBoard } from './entities/rw_billboard.entity';
import { CreateRwBillboardInput } from './dto/create-rw_billboard.input';
import { AdminGuard } from '../admin/admin.guard';
import { Role } from '../admin/role.decorator';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { Types } from 'mongoose';

@Resolver(() => RwBillBoard)
export class RwBillBoardResolver {
    constructor(private readonly rwBillboardService: RwBillBoardService) {}

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => RwBillBoard)
    rw_createBillboard(
        @Args('createRwBillboardInput')
        createRwBillboardInput: CreateRwBillboardInput
    ) {
        return this.rwBillboardService.create(createRwBillboardInput);
    }

    @Query(() => [RwBillBoard], { name: 'rw_billboards' })
    findAll() {
        return this.rwBillboardService.findAll();
    }

    @Query(() => RwBillBoard, { name: 'rw_billboard' })
    findOne(@Args('id', { type: () => String }) id: Types.ObjectId) {
        return this.rwBillboardService.findOne(id);
    }

    @Query(() => RwBillBoard, { name: 'rw_billboardByLocation' })
    async findOneByLocation(
        @Args('location', { type: () => String }) location: string
    ) {
        const res = await this.rwBillboardService.findOneByLocation(location);
        if (res) return res;
        throw new BadRequestException('No billboard found');
    }

    @UseGuards(AdminGuard)
    @Role('admin')
    @Mutation(() => RwBillBoard)
    rw_removebillboard(@Args('id', { type: () => String }) id: Types.ObjectId) {
        return this.rwBillboardService.remove(id);
    }
}
