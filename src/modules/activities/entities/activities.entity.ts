import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Collection } from 'src/modules/collections/entities/collection.entity';
import { Post } from 'src/modules/feeds/entities/post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { ActivityTypes } from '../activities.enums';
import { Types } from 'mongoose';
import { UserProfile } from '../dto/get-activities.dto';
import { COLLECTIONS } from 'src/constants/db.collections';

export type ActivityDocument = Activity & Document;

@ObjectType()
export class ActTokenData {
    @Field({ nullable: true })
    @Prop()
    tokenId: string;

    @Field({ nullable: true })
    @Prop()
    image: string;

    @Field({ nullable: true })
    @Prop()
    name: string;

    @Field({ nullable: true })
    @Prop()
    contract: string;
}

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

    @Field(() => UserProfile, {
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
    @Prop({ type: Types.ObjectId, ref: COLLECTIONS })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    nftCollection: Types.ObjectId;

    @Field(() => Post, {
        description: 'Name field (placeholder)',
        nullable: true
    })
    @Prop({ type: Types.ObjectId, ref: Post.name })
    post: Types.ObjectId;

    @Field(() => ActTokenData, {
        description: 'Name field (placeholder)',
        nullable: true
    })
    @Prop({ type: ActTokenData })
    token: ActTokenData;

    @Field(() => Date, { nullable: true })
    createdAt?: Date;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
