import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { USERS } from 'src/constants/db.collections';
import { User } from 'src/modules/users/entities/user.entity';
import { Status } from '../staking.enums';
import { Post } from 'src/modules/feeds/entities/post.entity';

export type StakingCollectionDocument = StakingCollection & Document;
@Schema({ timestamps: true })
@ObjectType()
export class StakingCollection extends Document {
    @Field()
    _id: string;

    @Field(() => String, {
        description: 'Name field (placeholder)',
        nullable: true
    })
    @Prop()
    name: string;

    @Field(() => String, { description: 'Category name field (placeholder)' })
    @Prop()
    category: string;

    @Field(() => String, { description: 'Utility name field (placeholder)' })
    @Prop()
    utility: string;

    @Field(() => String, { description: 'Metaverse name field (placeholder)' })
    @Prop()
    metaverse: string;

    @Field(() => String, { nullable: true })
    @Prop()
    chain: string;

    @Field(() => String, { nullable: true })
    @Prop()
    tokenId: string;

    @Field(() => Int, { nullable: true })
    @Prop()
    chainId: number;

    @Field(() => String, { nullable: true })
    @Prop()
    collectionAddress: string;

    @Field(() => String, { nullable: true })
    @Prop()
    collectionName: string;

    @Field(() => String, { nullable: true })
    @Prop()
    tokenAddress: string;

    @Field(() => String, { nullable: true })
    @Prop()
    tokenName: string;

    @Field(() => String, { nullable: true })
    @Prop()
    stakingAddress: string;

    // @Field(() => String, { nullable: true })
    // @Prop()
    // stakingName: string;

    @Field(() => String, { nullable: true })
    @Prop()
    logoUrl?: string;

    @Field(() => String, { nullable: true })
    @Prop()
    bannerUrl: string;

    @Field(() => String, { nullable: true })
    @Prop({ enum: Status })
    status: string;

    @Field(() => String, { nullable: true })
    @Prop()
    description?: string;

    @Field(() => [User], { nullable: true })
    @Prop({ type: Types.ObjectId, ref: USERS })
    likes: Types.ObjectId[];

    @Field(() => [User], { nullable: true })
    @Prop({ type: Types.ObjectId, ref: USERS })
    views: Types.ObjectId[];

    @Field(() => Post, {
        nullable: true,
        description: 'Post ID of related post'
    })
    @Prop({ type: Types.ObjectId, ref: 'Post', default: null })
    post?: Types.ObjectId | null;

    @Field(() => Date, { nullable: true })
    @Prop({ type: Date, default: new Date() })
    startedAt: Date;

    // reposts:Types.ObjectId[];
}

export const StakingCollectionSchema =
    SchemaFactory.createForClass(StakingCollection);
