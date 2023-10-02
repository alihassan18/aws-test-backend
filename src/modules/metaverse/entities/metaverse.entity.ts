import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MetaverseDocument = Metaverse & Document;
@Schema({ timestamps: true })
@ObjectType()
export class Metaverse extends Document {
    @Field()
    _id: string;

    @Field(() => String, { description: 'Name field (placeholder)' })
    @Prop({ unique: true })
    name: string;
}

export const MetaverseSchema = SchemaFactory.createForClass(Metaverse);
