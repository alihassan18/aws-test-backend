import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { USERS } from 'src/constants/db.collections';
import { User } from 'src/modules/users/entities/user.entity';

export type RwCharacterDocument = RwCharacter & Document;

@ObjectType()
class AnimationChr {
    @Field(() => String)
    @Prop({
        type: String
    })
    animation: string;

    @Field(() => String)
    @Prop({
        type: String
    })
    slot: string;
}

@ObjectType()
class TicketsChr {
    @Field(() => String)
    @Prop({
        type: String
    })
    ticket: string;

    @Field(() => String)
    @Prop({
        type: String
    })
    slot: string;
}

@Schema({ timestamps: true, collection: 'rw_characters' })
@ObjectType()
export class RwCharacter {
    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: USERS, index: true })
    user: Types.ObjectId;

    @Field(() => String)
    @Prop({
        type: String,
        default: ''
    })
    skinColor: string;

    @Field(() => String)
    @Prop({
        type: String,
        default: ''
    })
    Hat: string;

    @Field(() => String)
    @Prop({
        type: String,
        default: ''
    })
    Torso: string;

    @Field(() => String)
    @Prop({
        type: String,
        default: ''
    })
    Pant: string;

    @Field(() => String)
    @Prop({
        type: String,
        default: ''
    })
    Shoes: string;

    @Field(() => String)
    @Prop({
        type: String,
        default: ''
    })
    Glasses: string;

    @Field(() => String)
    @Prop({
        type: String,
        default: ''
    })
    Golves: string;

    @Field(() => String)
    @Prop({
        type: String,
        default: ''
    })
    Belt: string;

    @Field(() => String)
    @Prop({
        type: String,
        default: ''
    })
    gender: string;

    @Field(() => String)
    @Prop({
        type: String,
        default: ''
    })
    backpack: string;

    @Field(() => [AnimationChr], { nullable: true })
    @Prop([{ type: AnimationChr }])
    AnimationSlots?: AnimationChr[];

    @Field(() => [TicketsChr], { nullable: true })
    @Prop([{ type: TicketsChr }])
    Tickets?: TicketsChr[];
}

export const RwCharacterSchema = SchemaFactory.createForClass(RwCharacter);
