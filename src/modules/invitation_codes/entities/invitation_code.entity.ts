import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { USERS } from 'src/constants/db.collections';
import { User } from 'src/modules/users/entities/user.entity';

export type InvitationCodeDocument = InvitationCode & Document;

@Schema({ timestamps: true, collection: 'invitation_codes' })
@ObjectType()
export class InvitationCode {
    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: USERS, index: true })
    user: Types.ObjectId;

    @Field(() => String)
    @Prop({
        type: String
    })
    code: string;

    @Field(() => String)
    @Prop({
        type: String
    })
    email: string;
}

export const InvitationCodeSchema =
    SchemaFactory.createForClass(InvitationCode);
