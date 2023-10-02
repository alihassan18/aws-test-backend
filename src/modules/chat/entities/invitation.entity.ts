import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Group } from 'src/modules/chat/entities/group.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Invitation extends Document {
    @Field(() => String)
    _id: string;

    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    from: Types.ObjectId;

    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    to: Types.ObjectId;

    @Field(() => Group, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'Group' })
    groupId: Types.ObjectId;

    @Field(() => String)
    @Prop()
    type: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
