import { CreateReferralVideoInput } from './create-referral-video.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateReferralVideoInput extends PartialType(
    CreateReferralVideoInput
) {
    @Field(() => Int)
    id: number;
}
