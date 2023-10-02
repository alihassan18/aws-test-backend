import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Message } from './message.entity';

export type GroupDocument = Group & Document;

@ObjectType()
export class MemberEntry {
    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: 'User' })
    member: Types.ObjectId;

    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: 'User' })
    addedBy: Types.ObjectId;
}

@ObjectType()
export class GroupSetting {
    @Field(() => Boolean)
    @Prop({ type: Boolean, default: true })
    image: boolean;

    @Field(() => Boolean)
    @Prop({ type: Boolean, default: true })
    video: boolean;

    @Field(() => Boolean)
    @Prop({ type: Boolean, default: true })
    voice: boolean;

    @Field(() => Boolean)
    @Prop({ type: Boolean, default: true })
    files: boolean;

    @Field(() => Boolean)
    @Prop({ type: Boolean, default: true })
    gif: boolean;

    @Field(() => Boolean)
    @Prop({ type: Boolean, default: true })
    link: boolean;

    @Field(() => Boolean)
    @Prop({ type: Boolean, default: true })
    poll: boolean;

    @Field(() => Boolean)
    @Prop({ type: Boolean, default: true })
    mute: boolean;
}

@ObjectType()
export class GroupPrivacy {
    @Field(() => Number)
    @Prop({ type: Number, default: 0 })
    invite: number;

    @Field(() => Number)
    @Prop({ type: Number, default: 0 })
    post: number;

    @Field(() => Number)
    @Prop({ type: Number, default: 0 })
    call: number;
}
@ObjectType()
@Schema({ timestamps: true })
export class Group extends Document {
    @Field(() => String)
    _id: string;

    @Field(() => String)
    @Prop({ required: true })
    name: string;

    @Field(() => String, { nullable: true })
    @Prop()
    description: string;

    @Field(() => String, { nullable: true })
    @Prop()
    avatar: string;

    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: Types.ObjectId;

    @Field(() => [User])
    @Prop([{ type: Types.ObjectId, ref: 'User' }])
    admins: Types.ObjectId[];

    @Field(() => Number, { nullable: true })
    @Prop({
        type: Number,
        default: 0
    })
    unseenMsgCount: number;

    @Field(() => Message, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'Message' })
    lastMessage: Types.ObjectId;

    @Field(() => [MemberEntry])
    @Prop()
    members: MemberEntry[];

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => GroupSetting)
    @Prop({ type: GroupSetting })
    setting: GroupSetting;

    @Field(() => GroupPrivacy)
    @Prop({ type: GroupPrivacy })
    privacy: GroupPrivacy;

    @Field(() => Boolean)
    @Prop({ type: Boolean, default: false })
    isLiveSupport: boolean;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
