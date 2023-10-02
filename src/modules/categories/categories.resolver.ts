import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CategoryService } from './categories.service';
import { Category, CategoryDocument } from './entities/categories.entity';
import { CreateCategoryInput } from './dto/create-categories.input';
import {
    CategoryFilterInput,
    UpdateCategoryInput
} from './dto/update-categories.input';
import { FilterQuery } from 'mongoose';

@Resolver(() => Category)
export class CategoryResolver {
    constructor(private readonly stakinService: CategoryService) {}

    @Mutation(() => Category)
    createCategory(
        @Args('createCategoryInput')
        createCategoryInput: CreateCategoryInput
    ) {
        return this.stakinService.create(createCategoryInput);
    }

    @Query(() => [Category], { name: 'categories' })
    findAll(
        @Args('query', { type: () => CategoryFilterInput, nullable: true })
        query: FilterQuery<CategoryDocument>
    ) {
        return this.stakinService.findAll(query);
    }

    @Query(() => Category, { name: 'category' })
    findOne(@Args('id', { type: () => Int }) id: string) {
        return this.stakinService.findOne(id);
    }

    @Mutation(() => Category)
    updateCategory(
        @Args('updateCategoryInput')
        updateCategoryInput: UpdateCategoryInput
    ) {
        return this.stakinService.update(
            updateCategoryInput.id,
            updateCategoryInput
        );
    }

    @Mutation(() => Category)
    removeListing(@Args('id', { type: () => String }) id: string) {
        return this.stakinService.remove(id);
    }
}
