import { CreateContentCreatorInput } from './create-content.creator.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateContentCreatorInput extends PartialType(
    CreateContentCreatorInput
) {
    @Field(() => Int)
    id: number;
}
