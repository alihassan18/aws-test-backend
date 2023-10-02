import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class Hashtag extends Document {
    @Field(() => String, { description: 'Id field' })
    _id?: string;

    @Field(() => String, { description: 'Hashtag field' })
    @Prop({ type: String, unique: true, lowercase: true })
    name: string;

    @Field(() => Int, { defaultValue: 0 })
    @Prop({ type: Number, default: 0 })
    followersCount: number;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    followers: Types.ObjectId[];
}

export type HashtagDocument = Hashtag & Document;
export const HashtagSchema = SchemaFactory.createForClass(Hashtag);

// Create index
HashtagSchema.index({ name: 1 }, { unique: true });
