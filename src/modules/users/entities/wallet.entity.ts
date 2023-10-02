import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';

export type WalletDocument = Wallet & Document;
@Schema({ timestamps: true })
@ObjectType()
export class Wallet extends Document {
    @Field()
    _id: string;

    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Field(() => String, { nullable: true })
    @Prop({
        type: String
    })
    address: string;

    @Field(() => Boolean, { defaultValue: false })
    @Prop({
        type: Boolean
    })
    isPrimary: boolean;

    @Field(() => Boolean, { defaultValue: false })
    @Prop({
        type: Boolean
    })
    isHidden: boolean;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
