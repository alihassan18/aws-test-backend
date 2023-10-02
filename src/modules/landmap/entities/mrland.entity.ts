import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GraphQLJSONObject } from 'graphql-scalars';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Island } from './island.entity';
import { Post } from 'src/modules/feeds/entities/post.entity';

export type MrlandDocument = Mrland & Document;

@ObjectType()
export class LeaderBoard {
    @Field(() => [IslandUser], { nullable: true })
    owners: IslandUser[];

    @Field(() => Island)
    @Prop({ type: Island, ref: 'Island' })
    island: Island;
}

@ObjectType()
export class IslandUser {
    @Field(() => [User], { nullable: true })
    user: User[];

    @Field(() => Number)
    count: number;
}
@ObjectType()
export class IslandOwnerItem {
    @Field(() => String)
    owner: string;

    @Field(() => Number)
    magnitude: number;
}
@ObjectType()
export class LikesAndDislikesBy {
    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId;

    @Field(() => Date)
    at: Date;
}
@ObjectType()
export class IslandOwner {
    @Field(() => User, { nullable: true })
    user: User;

    @Field(() => Number, { nullable: true })
    landCount: number;

    @Field(() => String, { nullable: true })
    island: string;

    @Field(() => [User], { nullable: true })
    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    followers?: Types.ObjectId[];

    @Field(() => User, { nullable: true })
    info: User;

    @Field(() => Post, {
        nullable: true
    })
    @Prop({ type: Types.ObjectId, ref: 'Post', default: null })
    post?: Types.ObjectId | null;
}
@ObjectType()
export class Mrlands {
    @Field(() => GraphQLJSONObject)
    lands: Record<string, Mrland>;
}

@Schema({ timestamps: true })
@ObjectType()
export class Mrland extends Document {
    @Field()
    _id: string;

    @Field(() => Number)
    @Prop()
    landID: number;

    @Field(() => Number)
    @Prop()
    posX: number;

    @Field(() => Number)
    @Prop()
    posY: number;

    @Field(() => Number)
    @Prop()
    status: number;

    @Field(() => String)
    @Prop()
    owner: string;

    @Field(() => Number)
    @Prop()
    island: number;

    @Field(() => Number)
    @Prop()
    width: number;

    @Field(() => Number)
    @Prop()
    height: number;

    @Field(() => Number)
    @Prop()
    isPlot: number;

    @Field(() => String)
    @Prop()
    logo: string;

    @Field(() => String)
    @Prop()
    description: string;

    @Field(() => String)
    @Prop()
    name: string;

    @Field(() => String)
    @Prop()
    network: string;

    @Field(() => Boolean)
    @Prop({
        type: Boolean,
        default: false
    })
    billboard: boolean;

    @Field(() => Post, {
        nullable: true,
        description: 'Post ID of related post'
    })
    @Prop({ type: Types.ObjectId, ref: 'Post', default: null })
    post?: Types.ObjectId | null;

    @Field(() => Int, { defaultValue: 0, nullable: true })
    @Prop({ default: 0 })
    likes: number;

    @Field(() => [LikesAndDislikesBy], { nullable: true })
    @Prop({ type: [{ user: Types.ObjectId, at: Date }], default: [] })
    likesBy: LikesAndDislikesBy[];

    @Field(() => Int, { defaultValue: 0, nullable: true })
    @Prop({ default: 0 })
    dislikes: number;

    @Field(() => [LikesAndDislikesBy], { nullable: true })
    @Prop({ type: [{ user: Types.ObjectId, at: Date }], default: [] })
    dislikesBy: LikesAndDislikesBy[];
}

export const MrlandSchema = SchemaFactory.createForClass(Mrland);
MrlandSchema.index({ owner: 1, landID: 1 }, { unique: true });
MrlandSchema.index({ landID: 1 });
MrlandSchema.index({ owner: 1 });
