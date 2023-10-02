// src/modules/polls/entities/poll.entity.ts
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';

export type PollDocument = Poll & Document;
export type PollOptionDocument = PollOption & Document;

@Schema()
@ObjectType()
export class PollOption {
    @Field()
    @Prop()
    text: string;

    @Field()
    @Prop({ default: 0 })
    votes: number;

    @Field(() => [User])
    @Prop([{ type: Types.ObjectId, ref: 'User' }])
    voters: Types.ObjectId[];
}

@Schema()
@ObjectType()
export class Poll {
    @Field()
    @Prop()
    question: string;

    @Field(() => [PollOption])
    @Prop([PollOption])
    options: PollOptionDocument[];

    @Field(() => Date, { nullable: true })
    @Prop({ type: Date, default: null })
    expiresAt?: Date;
}

export const PollSchema = SchemaFactory.createForClass(Poll);
