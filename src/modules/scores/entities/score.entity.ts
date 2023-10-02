// entities/reaction.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { USERS } from 'src/constants/db.collections';
import { ActionType } from '../scores.enum';

registerEnumType(ActionType, {
    name: 'ActionType'
});

@ObjectType()
@Schema()
export class Score extends Document {
    @Field()
    _id: string;

    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: USERS })
    user: Types.ObjectId;

    @Field(() => ActionType)
    @Prop({ required: true, enum: ActionType })
    action: string;

    @Field(() => Number)
    @Prop({ type: Number, required: true })
    score: number;

    @Field(() => Date, { nullable: true })
    @Prop({ type: Date, default: null })
    createdAt: Date;
}

export type ScoreDocument = Score & Document;
export const ScoreSchema = SchemaFactory.createForClass(Score);
