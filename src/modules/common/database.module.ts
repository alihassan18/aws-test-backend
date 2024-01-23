// some.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from '../users/entities/user.entity';
import {
    Verification,
    VerificationSchema
} from '../verification/entities/verification.entity';
import { USERS } from 'src/constants/db.collections';
import { Review, ReviewSchema } from '../reviews/entities/review.entity';
import { Product, ProductSchema } from '../products/entities/product.entity';

const models = [
    { name: USERS, schema: UsersSchema },
    { name: Verification.name, schema: VerificationSchema },
    { name: Review.name, schema: ReviewSchema },
    { name: Product.name, schema: ProductSchema }
];
@Module({
    imports: [MongooseModule.forFeature(models)],
    exports: [MongooseModule.forFeature(models)]
})
export class DatabaseModule {}
