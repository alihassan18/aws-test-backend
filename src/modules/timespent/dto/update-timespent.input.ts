import { CreateTimespentInput } from './create-timespent.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTimespentInput extends PartialType(CreateTimespentInput) {
    @Field(() => Int)
    id: number;
}
