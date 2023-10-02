import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RwBuildingDocument = RwBuilding & Document;

@Schema({ timestamps: true, collection: 'rw_buildings' })
@ObjectType()
export class RwBuilding {
    @Field(() => String)
    @Prop({
        type: String
    })
    title: string;

    @Field(() => String)
    @Prop({
        type: String
    })
    desc: string;

    @Field(() => [String])
    @Prop({
        type: [String],
        default: []
    })
    title_images: string[];

    @Field(() => [String])
    @Prop({
        type: [String]
    })
    nft_images: string[];

    @Field(() => String)
    @Prop({
        type: String
    })
    ubindex: string;
}

export const RwBuildingSchema = SchemaFactory.createForClass(RwBuilding);
