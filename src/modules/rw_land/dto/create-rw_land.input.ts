import { InputType, Field } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class CreateRwLandInput {
    @Field(() => String, { nullable: true })
    id?: Types.ObjectId;

    @Field(() => Number)
    LandID: number;

    @Field(() => String)
    Data: string;
}
