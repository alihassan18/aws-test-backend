import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
@Schema()
export class Product {
    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    @Prop()
    title?: string;

    @Field({ nullable: true })
    @Prop()
    brand?: string;

    @Field(() => [String], { nullable: 'itemsAndList' })
    @Prop({ type: [String] })
    feature?: string[];

    @Field(() => [String], { nullable: 'itemsAndList' })
    @Prop({ type: [String] })
    description?: string[];

    @Field({ nullable: true })
    @Prop()
    price?: string;

    @Field(() => [String], { nullable: 'itemsAndList' })
    @Prop({ type: [String] })
    also_view?: string[];

    @Field(() => [String], { nullable: 'itemsAndList' })
    @Prop({ type: [String] })
    also_buy?: string[];

    @Field({ nullable: true })
    @Prop()
    rank?: string;

    @Field(() => GraphQLJSON, { nullable: true })
    @Prop({ type: mongoose.Schema.Types.Mixed })
    tech1?: mongoose.Schema.Types.Mixed;

    @Field({ nullable: true })
    @Prop()
    date?: string;

    @Field({ nullable: true })
    @Prop({ unique: true })
    asin?: string;

    @Field(() => [String], { nullable: 'itemsAndList' })
    @Prop({ type: [String] })
    imageURL?: string[];

    @Field(() => [String], { nullable: 'itemsAndList' })
    @Prop({ type: [String] })
    imageURLHighRes?: string[];
}

export type ProductDocument = Product & mongoose.Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
