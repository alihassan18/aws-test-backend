import { Types } from 'mongoose';
import { CreateRwBuildingInput } from './create-rw_building.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRwBuildingInput extends PartialType(CreateRwBuildingInput) {
    @Field(() => String)
    id: Types.ObjectId;
}
