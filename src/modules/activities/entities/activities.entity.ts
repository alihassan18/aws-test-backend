import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Collection } from 'src/modules/collections/entities/collection.entity';
import { Post } from 'src/modules/feeds/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { ActivityTypes } from '../activities.enums';
import { Types } from 'mongoose';

export type ActivityDocument = Activity & Document;

registerEnumType(ActivityTypes, {
    name: 'ActivityTypes'
});

@Schema({ timestamps: true })
@ObjectType()
export class Activity extends Document {
    @Field()
    _id: string;

    @Field(() => ActivityTypes, {
        description: 'Name field (placeholder)'
    })
    @Prop({ type: String, enum: ActivityTypes })
    type: ActivityTypes;

    @Field(() => User, {
        description: 'Name field (placeholder)',
        nullable: true
    })
    @Prop({ type: Types.ObjectId, ref: User.name })
    user: Types.ObjectId;

    @Field(() => Collection, {
        description: 'Name field (placeholder)',
        name: 'nftCollection',
        nullable: true
    })
    @Prop({ type: Types.ObjectId, ref: Collection.name })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    nftCollection: Types.ObjectId;

    @Field(() => Post, {
        description: 'Name field (placeholder)',
        nullable: true
    })
    @Prop({ type: Types.ObjectId, ref: Post.name })
    post: Types.ObjectId;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
