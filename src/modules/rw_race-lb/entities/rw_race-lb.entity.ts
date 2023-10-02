import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RwRaceLBDocument = RwRaceLb & Document;

@Schema({ timestamps: true, collection: 'rw_raceLB' })
@ObjectType()
export class RwRaceLb {
    @Field()
    _id: string;

    @Field(() => String)
    @Prop({
        type: String
    })
    email: string;

    @Field(() => String)
    @Prop({
        type: String
    })
    name: string;

    @Field(() => Number)
    @Prop({
        type: Number,
        default: 0
    })
    laptime: number;

    // @Field(() => Number)
    // @Prop({
    //     type: Number,
    //     default: 0
    // })
    // dailylaptime: number;

    // @Field(() => Number)
    // @Prop({
    //     type: Number,
    //     default: 0
    // })
    // weeklylaptime: number;

    // @Field(() => Number)
    // @Prop({
    //     type: Number,
    //     default: 0
    // })
    // monthlylaptime: number;

    // @Field(() => Number)
    // @Prop({
    //     type: Number,
    //     default: 0
    // })
    // yearlylaptime: number;

    @Field(() => Number)
    @Prop({
        type: Number
    })
    updateTime: number;
}

export const RwRaceLbSchema = SchemaFactory.createForClass(RwRaceLb);
