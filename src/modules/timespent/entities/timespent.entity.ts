import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Post } from 'src/modules/feeds/entities/post.entity';
// import { User } from 'src/modules/users/entities/user.entity';

export type TimeSpentDocument = TimeSpent & Document;

@Schema()
@ObjectType()
export class TimeSpent {
    @Field(() => String)
    @Prop({ type: String })
    socketId: string;
    // @Field(() => User)
    // @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    // user: Types.ObjectId;

    @Field(() => Post)
    @Prop({ type: Types.ObjectId, ref: 'Post' })
    post: Types.ObjectId;

    @Prop({ required: true, default: 0 })
    timeSpent: number;
}

export const TimeSpentSchema = SchemaFactory.createForClass(TimeSpent);

// TimeSpentSchema.path('post').validate(function () {
//     return this.post != null || this.comment != null;
// }, 'Either post or comment must be set.');
