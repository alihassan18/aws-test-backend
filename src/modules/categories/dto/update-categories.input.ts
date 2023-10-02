import { CreateCategoryInput } from './create-categories.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryInput extends PartialType(CreateCategoryInput) {
    @Field(() => String)
    id: string;
}

@InputType()
export class CategoryFilterInput {
    @Field(() => String, { nullable: true })
    name?: string;
}
