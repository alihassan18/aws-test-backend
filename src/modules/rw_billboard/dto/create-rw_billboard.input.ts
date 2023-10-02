import { InputType, Field } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class CreateRwBillboardInput {
    @Field(() => String, { nullable: true })
    id?: Types.ObjectId;

    @Field(() => [String])
    media: string[];

    @Field(() => String)
    location: string;
}
