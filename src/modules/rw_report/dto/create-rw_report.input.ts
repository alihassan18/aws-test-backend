import { InputType, Field } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class CreateRwReportInput {
    @Field(() => String, { nullable: true })
    reported?: Types.ObjectId;

    @Field(() => String, { nullable: true })
    mediaId?: Types.ObjectId;

    @Field(() => String, { nullable: true })
    media?: string;

    @Field(() => String)
    content: string;

    @Field(() => String, { nullable: true })
    type?: string;
}
