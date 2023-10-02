import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Types } from 'mongoose';
// import { User } from 'src/modules/users/entities/user.entity';

// @ObjectType()
// class RwVoteLand {
//     @Field(() => User)
//     @Prop({
//         type: Types.ObjectId
//     })
//     user: Types.ObjectId

//     @Field(() => Date)
//     @Prop({
//         type: Date,
//         default: new Date()
//     })
//     votedAt: Date

//     @Field(() => Number, { nullable: true })
//     @Prop({
//         type: Number
//     })
//     positiveVote?: number

//     @Field(() => Number, { nullable: true })
//     @Prop({
//         type: Number
//     })
//     negitiveVote?: number
// }

export type RwLandDocument = RwLand & Document;
@Schema({ timestamps: true, collection: 'rw_land' })
@ObjectType()
export class RwLand {
    @Field(() => Number)
    @Prop({
        type: Number,
        required: true,
        unique: true
    })
    LandID: number;

    @Field(() => String)
    @Prop({
        type: String,
        required: true
    })
    Data: string;

    // @Field(() => User)
    // @Prop({
    //     type: Types.ObjectId
    // })
    // user: Types.ObjectId

    // @Field(() => [RwVoteLand])
    // votes: [RwVoteLand]
}

export const RwLandSchema = SchemaFactory.createForClass(RwLand);
