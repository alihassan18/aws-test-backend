import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Schema as MongooseSchema, ObjectId } from 'mongoose';

export type ReferralDocument = Referral & Document;

@Schema({ timestamps: true })
@ObjectType()
export class Referral {
    @Field(() => [User], { nullable: true })
    @Prop({
        type: [
            {
                id: { type: MongooseSchema.Types.ObjectId, ref: User.name },
                createdAt: { type: Date, default: new Date() }
            }
        ],
        default: []
    })
    allReferral: [
        {
            id: ObjectId;
            createdAt: Date;
        }
    ];

    @Field(() => Number)
    @Prop({
        default: 0
    })
    count: number;

    @Field(() => User)
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
    user: ObjectId;

    @Field(() => Number)
    @Prop({
        default: 0
    })
    level: number;

    @Field(() => Number)
    @Prop({
        default: 0
    })
    commissionPercentage: number;

    @Field(() => Number)
    @Prop({
        default: 0
    })
    currentPrice: number;

    @Field(() => Number)
    @Prop({
        default: 0
    })
    totalRedeemed: number;

    @Field(() => Number)
    @Prop({
        default: 0
    })
    referralVolumeTraded: number;

    @Field(() => Boolean)
    @Prop({
        default: false
    })
    requested: boolean;
}

export const ReferralSchema = SchemaFactory.createForClass(Referral);
