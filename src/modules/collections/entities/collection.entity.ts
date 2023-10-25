import { ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { USERS } from 'src/constants/db.collections';
import { Post } from 'src/modules/feeds/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Schema()
@ObjectType()
export class LinkPreview {
    @Field(() => String, { nullable: true })
    @Prop()
    link_preview: string;
}

export type CollectionDocument = Collection & Document;
@Schema({ timestamps: true })
@ObjectType()
export class Collection extends Document {
    @Field()
    _id: string;

    @Field(() => String, { description: 'name field (placeholder)' })
    @Prop()
    name: string;

    @Field(() => String, { description: 'name field (placeholder)' })
    @Prop()
    slug: 'space-id-arb-name';

    @Field(() => Int, { description: 'tokenCount' })
    @Prop()
    tokenCount: number;

    @Field(() => Int, { description: 'onSaleCount' })
    @Prop()
    onSaleCount: number;

    @Field(() => String, { nullable: true })
    @Prop()
    currency: string;

    @Field(() => Float, { nullable: true })
    @Prop()
    token_count: number;

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
    external_url?: string;

    @Field(() => [String], { nullable: true })
    @Prop()
    sample_images?: string[];

    @Field(() => String, { nullable: true })
    @Prop()
    image?: string;

    @Field(() => String, { nullable: true })
    @Prop()
    owner?: string;

    @Field(() => String, { nullable: true })
    @Prop()
    banner: string;

    @Field(() => Float, { nullable: true })
    @Prop()
    supply: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    owners_total: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    sales_1d: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    sales_7d: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    sales_30d: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    sales_total: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    volume_1d: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    volume_7d: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    volume_30d: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    volume_total?: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    floor_price?: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    highest_price?: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    average_price_1d: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    average_price_7d: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    average_price_30d: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    average_price_total: number;

    @Field(() => String, { nullable: true })
    @Prop()
    average_price_change_1d: string;

    @Field(() => Float, { nullable: true })
    @Prop()
    average_price_change_7d: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    average_price_change_30d: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    volume_change_1d: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    volume_change_7d: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    market_cap: number;

    @Field(() => Float, { nullable: true })
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
    twitch?: string;

    @Field(() => String, { nullable: true })
    @Prop()
    land_id: string;

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
    youtube: string;

    @Field(() => String, { nullable: true })
    @Prop()
    facebook: string;

    @Field(() => String, { nullable: true })
    @Prop()
    tiktok: string;

    @Field(() => String, { nullable: true })
    @Prop()
    web: string;

    @Field(() => String, { nullable: true })
    @Prop()
    instagram: string;

    @Field(() => String, { nullable: true })
    @Prop()
    medium: string;

    @Field(() => String, { nullable: true })
    @Prop()
    linkedin: string;

    @Field(() => String, { nullable: true })
    @Prop()
    featured_url: string;

    @Field(() => String, { nullable: true })
    @Prop()
    large_image_url: string;

    @Field(() => String, { nullable: true })
    @Prop()
    ipfs_json_url: string;

    @Field(() => String, { nullable: true })
    @Prop()
    ipfs_image_url: string;

    @Field(() => String, { nullable: true })
    @Prop()
    erc_type: string;

    @Field(() => Float, { nullable: true })
    @Prop()
    deploy_block_number: number;

    @Field(() => User, {
        nullable: true,
        description: 'Creator of the collection'
    })
    @Prop({ type: Types.ObjectId, ref: 'User' })
    creator: Types.ObjectId;

    @Field(() => Post, {
        nullable: true,
        description: 'Related post for a collection'
    })
    @Prop({ type: Types.ObjectId, ref: Post.name })
    post?: Types.ObjectId;

    @Field(() => String, {
        nullable: true,
        description: 'Deployer address'
    })
    @Prop()
    deployer_address: string;

    @Field(() => Boolean, { nullable: true })
    @Prop()
    verified: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ default: false })
    is_content_creator: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ default: false })
    is_metaverse: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop()
    is_auto_auction: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop()
    is_auto_mint: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ default: false })
    is_fetched: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ default: false })
    is_all_tokens_fetched: boolean;

    @Field(() => Float, { nullable: true })
    @Prop()
    tokens_fetched_count: number;

    @Field(() => Boolean, { nullable: true })
    @Prop({ default: false })
    is_all_listings_fetched: boolean;

    @Field(() => Float, { nullable: true })
    @Prop()
    listings_fetched_count: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    listing_price: number;

    @Field(() => String, { nullable: true })
    @Prop({ enum: ['Fixed', 'Auction'] })
    listing_type: string;

    @Field(() => Float, {
        nullable: true,
        description: 'Action duration in the unix timestamps'
    })
    @Prop()
    auction_duration: number;
    /* content creator fields */

    @Field(() => Boolean, { nullable: true })
    @Prop()
    opensea_verified: boolean;

    @Field(() => Float, { nullable: true })
    @Prop()
    royalty: number;

    @Field(() => Float, { nullable: true })
    @Prop()
    amounts_total: number;

    @Field(() => [String], { nullable: true })
    @Prop()
    collections_with_same_name: [];

    @Field(() => String, { nullable: true })
    @Prop()
    price_symbol: string;

    @Field(() => [User], { nullable: true })
    @Prop({ type: Types.ObjectId, ref: USERS, default: [] })
    followers: Types.ObjectId[];

    @Field(() => Float, { defaultValue: 0 })
    @Prop({ default: 0 })
    followersCount: number;

    @Field(() => Float, { defaultValue: 0 })
    @Prop({ default: 0 })
    collectionViews: number;

    @Field(() => [Date], { defaultValue: [new Date()] })
    @Prop({ default: [new Date()] })
    collectionViewsTimestamps: Date[];

    @Field(() => [User], { nullable: true })
    @Prop({ type: Types.ObjectId, ref: USERS })
    favourites: Types.ObjectId[];

    @Field(() => [User], { nullable: true })
    @Prop({ type: Types.ObjectId, ref: USERS })
    likes: Types.ObjectId[];

    @Field(() => [User], { nullable: true })
    @Prop({ type: Types.ObjectId, ref: USERS })
    views: Types.ObjectId[];

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean })
    is_deleted?: boolean;

    @Field(() => String, { nullable: true })
    @Prop({ default: '' })
    link_preview?: string;

    @Field(() => String, { nullable: true })
    createdAt?: Date;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
CollectionSchema.index({ contract: 1, chain: 1 }, { unique: true });
