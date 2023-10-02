import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RwTutorialsDocument = RwTutorials & Document;

@Schema({ timestamps: true, collection: 'rw_tutorials' })
@ObjectType()
export class RwTutorials {
    @Field(() => String)
    @Prop({
        type: String
    })
    title: string;

    @Field(() => String, { nullable: true })
    @Prop({
        type: String
    })
    description: string;

    @Field(() => String)
    @Prop({
        type: String
    })
    video: string;
}

export const RwTutorialsSchema = SchemaFactory.createForClass(RwTutorials);
