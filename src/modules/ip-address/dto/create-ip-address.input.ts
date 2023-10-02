import { InputType, Field } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class CreateIpAddressInput {
    @Field(() => String)
    user: Types.ObjectId;

    @Field(() => String)
    ip_address: string;
}
