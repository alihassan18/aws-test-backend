import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product, ProductDocument } from './entities/product.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>
    ) {}

    async create(createProductInput: CreateProductInput): Promise<Product> {
        const createdProduct = new this.productModel(createProductInput);
        return createdProduct.save();
    }

    async findAll(
        page = 1,
        limit = 10
    ): Promise<{
        data: Product[];
        total: number;
        page: number;
        limit: number;
    }> {
        const skip = (page - 1) * limit;
        const total = await this.productModel.countDocuments();
        const data = await this.productModel
            .find()
            .skip(skip)
            .limit(limit)
            .exec();

        return {
            data,
            total,
            page,
            limit
        };
    }

    async findOne(id: string): Promise<Product> {
        return this.productModel.findById(id).exec();
    }

    async update(
        id: string,
        updateProductInput: UpdateProductInput
    ): Promise<Product> {
        return this.productModel
            .findByIdAndUpdate(id, updateProductInput, { new: true })
            .exec();
    }

    async remove(id: string): Promise<Product> {
        return this.productModel.findByIdAndRemove(id).exec();
    }
}
