import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RwBuildingTypesDocument = RwBuildingTypes & Document;

@Schema({ timestamps: true, collection: 'rw_buildings_types' })
@ObjectType()
export class RwBuildingTypes {
    @Field(() => String)
    @Prop({
        type: String
    })
    name: string;

    @Field(() => String)
    @Prop({
        type: String,
        unique: true
    })
    index: string;

    @Field(() => Number)
    @Prop({
        type: Number
    })
    bigImages: number;

    @Field(() => Number)
    @Prop({
        type: Number
    })
    smallImages: number;

    @Field(() => Boolean)
    @Prop({
        type: Boolean,
        default: false
    })
    assigned: boolean;
}

export const RwBuildingTypesSchema =
    SchemaFactory.createForClass(RwBuildingTypes);
