import { CreateRecentSearchInput } from './create-recent_search.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRecentSearchInput extends PartialType(
    CreateRecentSearchInput
) {
    @Field(() => Int)
    id: number;
}
