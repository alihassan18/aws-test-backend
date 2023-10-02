import { CreateRwFightLbInput } from './create-rw_fight-lb.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRwFightLbInput extends PartialType(CreateRwFightLbInput) {
    @Field(() => Int)
    id: number;
}
