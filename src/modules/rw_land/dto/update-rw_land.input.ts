import { CreateRwLandInput } from './create-rw_land.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRwLandInput extends PartialType(CreateRwLandInput) {}
