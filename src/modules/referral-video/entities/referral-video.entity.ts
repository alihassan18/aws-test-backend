import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Types } from 'mongoose';

export type ReferralVideoDocument = ReferralVideo & Document;

@Schema({ timestamps: true })
@ObjectType()
export class ReferralVideo {
    @Field(() => String)
    _id?: string;

    @Field(() => [User], { nullable: true })
    @Prop([{ type: Types.ObjectId, ref: 'User', default: [] }])
    fb: Types.ObjectId[];

    @Field(() => [User], { nullable: true })
    @Prop([{ type: Types.ObjectId, ref: 'User', default: [] }])
    whatsapp: Types.ObjectId[];

    @Field(() => [User], { nullable: true })
    @Prop([{ type: Types.ObjectId, ref: 'User', default: [] }])
    twitter: Types.ObjectId[];

    @Field(() => [User], { nullable: true })
    @Prop([{ type: Types.ObjectId, ref: 'User', default: [] }])
    linkedin: Types.ObjectId[];

    @Field(() => [User], { nullable: true })
    @Prop([{ type: Types.ObjectId, ref: 'User', default: [] }])
    instagram: Types.ObjectId[];

    @Field(() => [User], { nullable: true })
    @Prop([{ type: Types.ObjectId, ref: 'User', default: [] }])
    tiktok: Types.ObjectId[];

    @Field(() => [User], { nullable: true })
    @Prop([{ type: Types.ObjectId, ref: 'User', default: [] }])
    youtube: Types.ObjectId[];

    @Field({ nullable: true })
    @Prop({ required: true })
    src: string;
}

export const ReferralVideoSchema = SchemaFactory.createForClass(ReferralVideo);
