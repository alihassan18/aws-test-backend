import { CreateInvitationCodeInput } from './create-invitation_code.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateInvitationCodeInput extends PartialType(
    CreateInvitationCodeInput
) {
    @Field(() => Int)
    id: number;
}
