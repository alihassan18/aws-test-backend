import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RwFightLBDocument = RwFightLb & Document;

@Schema({ timestamps: true, collection: 'rw_fightLB' })
@ObjectType()
export class RwFightLb {
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
    damage: number;

    // @Field(() => Number)
    // @Prop({
    //     type: Number,
    //     default: 0
    // })
    // dailydamage: number;

    // @Field(() => Number)
    // @Prop({
    //     type: Number,
    //     default: 0
    // })
    // weeklydamage: number;

    // @Field(() => Number)
    // @Prop({
    //     type: Number,
    //     default: 0
    // })
    // monthlydamage: number;

    // @Field(() => Number)
    // @Prop({
    //     type: Number,
    //     default: 0
    // })
    // yearlydamage: number;

    @Field(() => Number)
    @Prop({
        type: Number,
        default: 0
    })
    deathTime: number;

    @Field(() => Number)
    @Prop({
        type: Number
    })
    updateTime: number;
}

export const RwFightLBSchema = SchemaFactory.createForClass(RwFightLb);
