import { CreateRwCharacterInput } from './create-rw_character.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRwCharacterInput extends PartialType(
    CreateRwCharacterInput
) {}
