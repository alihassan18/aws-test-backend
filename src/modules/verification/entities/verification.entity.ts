import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

export type VerificationDocument = Verification &
    Document & {
        updatedAt: Date;
        createdAt: Date;
    };

@Schema({ timestamps: true })
@ObjectType()
export class Verification extends Document {
    @Field(() => User!)
    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Field()
    @Prop()
    code: string;

    @Field(() => Boolean)
    @Prop({
        default: false
    })
    isVerified: boolean;

    @Field(() => Date)
    expiry: Date;

    @Field(() => String)
    type: string;

    @Field(() => Number)
    @Prop({
        default: 0
    })
    attempts: number;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
