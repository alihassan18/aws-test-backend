import { CreateUtilityInput } from './create-utilities.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUtilityInput extends PartialType(CreateUtilityInput) {
    @Field(() => String)
    id: string;
}

@InputType()
export class UtilityFilterInput {
    @Field(() => String, { nullable: true })
    name?: string;
}
