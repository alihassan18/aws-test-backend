import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { USERS } from 'src/constants/db.collections';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
@Schema()
class RWMessageNotification {
    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: true })
    _msgFreindRequest?: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: true })
    _msgNewEvent?: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: true })
    _msgRecieveingGift?: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: true })
    _msgTerrainGridInvisible?: boolean;
}

@ObjectType()
@Schema()
class RWPhoneNotification {
    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: true })
    _phoneFreindRequest?: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: true })
    _phoneNewEvent?: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: true })
    _phoneRecieveingGift?: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: true })
    _phoneTerrainGridInvisible?: boolean;
}

@ObjectType()
@Schema()
class RWMailNotification {
    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: true })
    _mailFreindRequest?: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: true })
    _mailNewEvent?: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: true })
    _mailRecieveingGift?: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: true })
    _mailTerrainGridInvisible?: boolean;
}

export type RwSettingsDocument = RwSettings & Document;

@Schema({ timestamps: true, collection: 'rw_settings' })
@ObjectType()
export class RwSettings {
    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: USERS, index: true })
    user: Types.ObjectId;

    @Field(() => Number)
    @Prop({
        default: 1
    })
    MouseScrollSensitivity: number;

    @Field(() => Number)
    @Prop({
        default: 1
    })
    GraphicsQuality: number;

    @Field(() => Boolean)
    @Prop({
        default: false
    })
    mapPlotPhoto: boolean;

    @Field(() => RWMessageNotification)
    @Prop(RWMessageNotification)
    MessageNotification: RWMessageNotification;

    @Field(() => RWPhoneNotification)
    @Prop(RWPhoneNotification)
    PhoneNotification: RWPhoneNotification;

    @Field(() => RWMailNotification)
    @Prop(RWMailNotification)
    MailNotification: RWMailNotification;
}

export const RwSettingsSchema = SchemaFactory.createForClass(RwSettings);
