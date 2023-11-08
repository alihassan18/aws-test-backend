import { CreateSalesInput } from './create-sales.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSalesInput extends PartialType(CreateSalesInput) {
    @Field(() => Int)
    id: number;
}
