import { CreateRwUsersMediaInput } from './create-rw_users_media.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRwUsersMediaInput extends PartialType(
    CreateRwUsersMediaInput
) {
    @Field(() => Int)
    id: number;
}
