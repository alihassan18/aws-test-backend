import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { Product } from '../entities/product.entity';

@InputType()
export class CreateProductInput {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number;
}

@ObjectType()
export class ProductPagination {
    @Field(() => [Product])
    data: Product[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    page: number;

    @Field(() => Int)
    limit: number;
}
