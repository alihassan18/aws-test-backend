import { InputType, Field } from '@nestjs/graphql';

@InputType()
class RWMessageNotificationInput {
    @Field(() => Boolean, { nullable: true })
    _msgFreindRequest?: boolean;

    @Field(() => Boolean, { nullable: true })
    _msgNewEvent?: boolean;

    @Field(() => Boolean, { nullable: true })
    _msgRecieveingGift?: boolean;

    @Field(() => Boolean, { nullable: true })
    _msgTerrainGridInvisible?: boolean;
}

@InputType()
class RWPhoneNotificationInput {
    @Field(() => Boolean, { nullable: true })
    _phoneFreindRequest?: boolean;

    @Field(() => Boolean, { nullable: true })
    _phoneNewEvent?: boolean;

    @Field(() => Boolean, { nullable: true })
    _phoneRecieveingGift?: boolean;

    @Field(() => Boolean, { nullable: true })
    _phoneTerrainGridInvisible?: boolean;
}

@InputType()
class RWMailNotificationInput {
    @Field(() => Boolean, { nullable: true })
    _mailFreindRequest?: boolean;

    @Field(() => Boolean, { nullable: true })
    _mailNewEvent?: boolean;

    @Field(() => Boolean, { nullable: true })
    _mailRecieveingGift?: boolean;

    @Field(() => Boolean, { nullable: true })
    _mailTerrainGridInvisible?: boolean;
}

@InputType()
export class UpdateRwSettingInput {
    @Field(() => Number, { nullable: true })
    MouseScrollSensitivity?: number;

    @Field(() => Number, { nullable: true })
    GraphicsQuality?: number;

    @Field(() => Boolean, { nullable: true })
    mapPlotPhoto?: boolean;

    @Field(() => RWMessageNotificationInput, { nullable: true })
    MessageNotification?: RWMessageNotificationInput;

    @Field(() => RWPhoneNotificationInput, { nullable: true })
    PhoneNotification?: RWPhoneNotificationInput;

    @Field(() => RWMailNotificationInput, { nullable: true })
    MailNotification?: RWMailNotificationInput;
}
