import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { USERS } from 'src/constants/db.collections';
import { User } from 'src/modules/users/entities/user.entity';

export type RwGameFlowerDocument = RwGameFlower & Document;

@Schema({ timestamps: true, collection: 'rw_game_flowers' })
@ObjectType()
export class RwGameFlower {
    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: USERS, index: true })
    user: Types.ObjectId;

    @Field(() => Number)
    @Prop({
        type: Number,
        default: 1
    })
    flowerValue: number;

    @Field(() => Date)
    @Prop({ type: Date })
    openAt: Date;

    @Field(() => Date, { nullable: true })
    @Prop({ type: Date })
    createdAt?: Date;
}

export const RwGameFlowerSchema = SchemaFactory.createForClass(RwGameFlower);
