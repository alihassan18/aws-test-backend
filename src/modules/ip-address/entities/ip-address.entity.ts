import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { USERS } from 'src/constants/db.collections';
import { User } from 'src/modules/users/entities/user.entity';

export type IPAddressDocument = IPAddress & Document;

@Schema({ timestamps: true, collection: 'ip_addresses' })
@ObjectType()
export class IPAddress {
    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: USERS, index: true })
    user: Types.ObjectId;

    @Field(() => String)
    @Prop({
        type: String
    })
    ip_address: string;
}

export const IPAddressSchema = SchemaFactory.createForClass(IPAddress);
