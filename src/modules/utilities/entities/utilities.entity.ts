import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UtilityDocument = Utility & Document;
@Schema({ timestamps: true })
@ObjectType()
export class Utility extends Document {
    @Field()
    _id: string;

    @Field(() => String, { description: 'Name field (placeholder)' })
    @Prop({ unique: true })
    name: string;
}

export const UtilitySchema = SchemaFactory.createForClass(Utility);
