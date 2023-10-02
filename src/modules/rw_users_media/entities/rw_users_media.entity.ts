import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { USERS } from 'src/constants/db.collections';
import { User } from 'src/modules/users/entities/user.entity';

export type RwUsersMediaDocument = RwUsersMedia & Document;

@Schema({ timestamps: true, collection: 'rw_users_media' })
@ObjectType()
export class RwUsersMedia {
    @Field()
    _id: string;

    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: USERS, index: true })
    user: Types.ObjectId;

    @Field(() => [String])
    @Prop({
        type: [String]
    })
    media: string[];

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: false })
    isSS?: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: false })
    isSR?: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: false })
    isFavourite?: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: false })
    isReport?: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: false })
    isRepost?: boolean;
}

export const RwUsersMediaSchema = SchemaFactory.createForClass(RwUsersMedia);
