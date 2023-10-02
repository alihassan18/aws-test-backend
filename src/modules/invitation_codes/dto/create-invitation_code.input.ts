import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateInvitationCodeInput {
    @Field(() => String)
    code: string;

    @Field(() => String)
    email: string;
}
