import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../users/entities/user.entity';
import { Types } from 'mongoose';
import { Prop } from '@nestjs/mongoose';

@ObjectType()
export class ScoresResult {
    @Field(() => String, { nullable: true })
    _id: string;

    @Field(() => User, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId;

    @Field(() => Number, { nullable: true })
    @Prop({ type: Number })
    monthScore: number;

    @Field(() => Number, { nullable: true })
    @Prop({ type: Number })
    rank: number;
}

@ObjectType()
export class HighScoreResult {
    @Field(() => String, { nullable: true })
    userId: string;

    @Field(() => Number)
    @Prop({ type: Number })
    score: number;
}
