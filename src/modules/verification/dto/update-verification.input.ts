import { CreateVerificationInput } from './create-verification.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVerificationInput extends PartialType(
    CreateVerificationInput
) {
    @Field(() => Int)
    id: number;
}
