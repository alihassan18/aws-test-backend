import { CreateListingInput } from './create-listing.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateListingInput extends PartialType(CreateListingInput) {
    @Field(() => Int)
    id: number;
}
