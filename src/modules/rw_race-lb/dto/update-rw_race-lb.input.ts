import { CreateRwRaceLbInput } from './create-rw_race-lb.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRwRaceLbInput extends PartialType(CreateRwRaceLbInput) {
    @Field(() => Int)
    id: number;
}
