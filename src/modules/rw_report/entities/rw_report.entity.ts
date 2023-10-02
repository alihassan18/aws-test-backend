import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { USERS } from 'src/constants/db.collections';
import { RwUsersMedia } from 'src/modules/rw_users_media/entities/rw_users_media.entity';
import { User } from 'src/modules/users/entities/user.entity';

export type RwReportDocument = RwReport & Document;

@Schema({ timestamps: true, collection: 'rw_reports' })
@ObjectType()
export class RwReport {
    @Field()
    _id: string;

    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: USERS, index: true })
    reporter: Types.ObjectId;

    @Field(() => User, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: USERS, index: true })
    reported?: Types.ObjectId;

    @Field(() => RwUsersMedia, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: RwUsersMedia.name, index: true })
    mediaId?: Types.ObjectId;

    @Field(() => String, { nullable: true })
    @Prop({
        type: String
    })
    media?: string;

    @Field(() => String, { nullable: true })
    @Prop({ type: String })
    content?: string;

    @Field(() => String, { nullable: true })
    @Prop({ type: String })
    type?: string;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: false })
    resolved?: boolean;
}

export const RwReportSchema = SchemaFactory.createForClass(RwReport);

// @Field(() => User)
// @Prop({ type: Types.ObjectId, ref: USERS, index: true })
// user: Types.ObjectId;

// @Field(() => String, { nullable: true })
// @Prop({
//     type: String
// })
// media: string;

// reporter:{
//   type: String,
//   required: true,
// },
// reported:{
//   type: String,
//   required: true,
// },
// content:{
//   type: String,
//   required: true,
// },
