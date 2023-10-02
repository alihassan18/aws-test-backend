import { CreateRwGameFlowerInput } from './create-rw_game_flower.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRwGameFlowerInput extends PartialType(
    CreateRwGameFlowerInput
) {}
