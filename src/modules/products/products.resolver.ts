import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import {
    CreateProductInput,
    ProductPagination
} from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Resolver(() => Product)
export class ProductsResolver {
    constructor(private readonly productsService: ProductsService) {}

    @Mutation(() => Product)
    createProduct(
        @Args('createProductInput') createProductInput: CreateProductInput
    ) {
        return this.productsService.create(createProductInput);
    }

    @Query(() => ProductPagination)
    async products(
        @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
        @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number
    ) {
        return this.productsService.findAll(page, limit);
    }

    @Query(() => Product, { name: 'product' })
    findOne(@Args('id', { type: () => String }) id: string) {
        return this.productsService.findOne(id);
    }

    @Mutation(() => Product)
    updateProduct(
        @Args('updateProductInput') updateProductInput: UpdateProductInput
    ) {
        return this.productsService.update(
            updateProductInput.id,
            updateProductInput
        );
    }

    @Mutation(() => Product)
    removeProduct(@Args('id', { type: () => String }) id: string) {
        return this.productsService.remove(id);
    }
}
