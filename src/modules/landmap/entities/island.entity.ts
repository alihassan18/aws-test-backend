import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IslandDocument = Island & Document;
@Schema({ timestamps: true })
@ObjectType()
export class Island extends Document {
    @Field()
    _id: string;

    @Field(() => Number, { nullable: true })
    @Prop({
        type: Number,
        default: 0
    })
    island: number;

    @Field(() => String, { nullable: true })
    @Prop({
        type: String
    })
    name: string;

    @Field(() => String, { nullable: true })
    @Prop({
        type: String
    })
    logo: string;

    @Field(() => String, { nullable: true })
    @Prop({
        type: String
    })
    description: string;
}

export const IslandSchema = SchemaFactory.createForClass(Island);
