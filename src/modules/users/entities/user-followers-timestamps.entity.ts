import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { User } from './user.entity';
import { Types } from 'mongoose';

@ObjectType()
@Schema()
export class FollowersTimestamps {
    @Field(() => User, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'User' })
    by?: Types.ObjectId;

    @Field(() => Date, { nullable: true })
    @Prop({ type: Date })
    createdAt: Date;
}
