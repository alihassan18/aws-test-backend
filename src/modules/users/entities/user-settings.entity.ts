import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { MessagePrivacy } from 'src/enums/messageprivacy.enum';
import { User } from './user.entity';

@ObjectType()
@Schema()
export class SettingsAlert {
    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: true
    })
    messenger: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: true
    })
    bids: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: true
    })
    sell: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: true
    })
    buy: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: true
    })
    like: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: true
    })
    mint: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: true
    })
    comment: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: true
    })
    follow: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: true
    })
    followed_post: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: true
    })
    followed_comment: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: true
    })
    followed_repost: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: true
    })
    followed_mint_post: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: true
    })
    followed_created_collection: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: true
    })
    followed_listed: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({
        type: Boolean,
        default: true
    })
    followed_sold: boolean;
}

@ObjectType()
@Schema()
export class Settings {
    @Field(() => SettingsAlert)
    @Prop(SettingsAlert)
    alerts: SettingsAlert;

    @Field(() => SettingsAlert)
    @Prop(SettingsAlert)
    email: SettingsAlert;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: false })
    twoFa?: boolean;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean, default: false })
    threeFa?: boolean;

    @Field(() => String)
    @Prop({
        type: String,
        default: MessagePrivacy.EVERYONE,
        enum: MessagePrivacy
    })
    messagePrivacy: string;

    @Field(() => Boolean)
    @Prop({
        type: Boolean,
        default: false
    })
    isLinkedInEnabled: boolean;

    @Field(() => Boolean)
    @Prop({
        type: Boolean,
        default: false
    })
    isTwitterEnabled: boolean;

    @Field(() => Boolean)
    @Prop({
        type: Boolean,
        default: false
    })
    isAutoMintEnabled: boolean;

    @Field(() => String)
    @Prop({
        type: String,
        default: false
    })
    lastMintedCollection: string;
}

@ObjectType()
@Schema()
export class UserRefetchResult {
    @Field(() => User)
    // @Prop(User)
    user: User;
}
