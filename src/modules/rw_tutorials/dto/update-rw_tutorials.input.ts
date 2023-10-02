import { Types } from 'mongoose';
import { CreateRwTutorialsInput } from './create-rw_tutorials.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRwTutorialsInput extends PartialType(
    CreateRwTutorialsInput
) {
    @Field(() => String)
    id: Types.ObjectId;
}
