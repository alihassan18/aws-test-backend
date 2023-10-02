import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';

export type HiddenTokensDocument = HiddenTokens & Document;

@Schema({ timestamps: true })
@ObjectType()
export class HiddenTokens {
    @Field()
    _id: string;

    @Field({ nullable: true })
    @Prop()
    contract: string;

    @Field(() => String, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: User.name })
    userId: Types.ObjectId;

    @Field({ defaultValue: 'ethereum' })
    @Prop({ default: 'ethereum' })
    chain: string;

    @Field({ nullable: true })
    @Prop()
    tokenId: string;
}

export const HiddenTokensSchema = SchemaFactory.createForClass(HiddenTokens);
