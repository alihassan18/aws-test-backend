import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { USERS } from 'src/constants/db.collections';
import { User } from 'src/modules/users/entities/user.entity';

export type ContentCreatorDocument = ContentCreator & Document;
@Schema({ timestamps: true })
@ObjectType()
export class ContentCreator extends Document {
    @Field()
    _id: string;

    @Field(() => String, { description: 'name field (placeholder)' })
    @Prop()
    name: string;

    @Field(() => Int, { description: 'name field (placeholder)' })
    @Prop({ type: Number, default: 0 })
    role: number;

    @Field(() => String, { nullable: true })
    @Prop()
    chain: string;

    @Field(() => Number, { nullable: true })
    @Prop()
    chainId: number;

    @Field(() => String, { nullable: true })
    @Prop()
    contract?: string;

    @Field(() => String, { nullable: true })
    @Prop()
    contract_name?: string;

    @Field(() => String, { nullable: true })
    @Prop()
    image?: string;

    @Field(() => String, { nullable: true })
    @Prop()
    banner: string;

    @Field(() => Int, { nullable: true })
    @Prop()
    items_total: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    owners_total: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    sales_1d: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    sales_7d: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    sales_30d: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    sales_total: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    volume_1d: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    volume_7d: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    volume_30d: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    volume_total?: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    floor_price?: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    average_price_1d: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    average_price_7d: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    average_price_30d: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    average_price_total: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    average_price_change_1d: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    average_price_change_7d: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    average_price_change_30d: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    volume_change_1d: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    volume_change_7d: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    market_cap: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    @Field(() => String, { nullable: true })
    @Prop()
    symbol: string;

    @Field(() => String, { nullable: true })
    @Prop()
    description?: string;

    @Field(() => String, { nullable: true })
    @Prop()
    website: string;

    @Field(() => String, { nullable: true })
    @Prop()
    email: string;

    @Field(() => String, { nullable: true })
    @Prop()
    twitter: string;

    @Field(() => String, { nullable: true })
    @Prop()
    discord: string;

    @Field(() => String, { nullable: true })
    @Prop()
    telegram: string;

    @Field(() => String, { nullable: true })
    @Prop()
    github: string;

    @Field(() => String, { nullable: true })
    @Prop()
    instagram: string;

    @Field(() => String, { nullable: true })
    @Prop()
    medium: string;

    @Field(() => String, { nullable: true })
    @Prop()
    featured_url: string;

    @Field(() => String, { nullable: true })
    @Prop()
    large_image_url: string;

    @Field(() => [String], { nullable: true })
    @Prop()
    attributes: [];

    @Field(() => String, { nullable: true })
    @Prop()
    erc_type: string;

    @Field(() => Int, { nullable: true })
    @Prop()
    deploy_block_number: number;

    @Field(() => User, {
        nullable: true,
        description: 'Creator of the collection'
    })
    @Prop({ type: Types.ObjectId, ref: User.name })
    creator: Types.ObjectId;

    @Field(() => Boolean, { nullable: true })
    @Prop()
    verified: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop()
    opensea_verified: boolean;

    @Field(() => Int, { nullable: true })
    @Prop()
    royalty: number;

    @Field(() => Int, { nullable: true })
    @Prop()
    amounts_total: number;

    @Field(() => [String], { nullable: true })
    @Prop()
    collections_with_same_name: [];

    @Field(() => String, { nullable: true })
    @Prop()
    price_symbol: string;

    @Field(() => [User], { nullable: true })
    @Prop({ type: Types.ObjectId, ref: USERS })
    followers: Types.ObjectId[];

    @Field(() => [User], { nullable: true })
    @Prop({ type: Types.ObjectId, ref: USERS })
    favourites: Types.ObjectId[];

    @Field(() => [User], { nullable: true })
    @Prop({ type: Types.ObjectId, ref: USERS })
    likes: Types.ObjectId[];

    @Field(() => [User], { nullable: true })
    @Prop({ type: Types.ObjectId, ref: USERS })
    views: Types.ObjectId[];
}

export const ContentCreatorSchema =
    SchemaFactory.createForClass(ContentCreator);
