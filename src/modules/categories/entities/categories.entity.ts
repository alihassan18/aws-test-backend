import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;
@Schema({ timestamps: true })
@ObjectType()
export class Category extends Document {
    @Field()
    _id: string;

    @Field(() => String, {
        description: 'Name field (placeholder)',
        nullable: true
    })
    @Prop({ unique: true })
    name: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
