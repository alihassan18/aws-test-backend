import { InputType, Field } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class CreateRecentSearchInput {
    @Field(() => String, { nullable: true })
    _collection: Types.ObjectId;

    @Field(() => String, { nullable: true })
    userToSearch: Types.ObjectId;

    @Field(() => String, { nullable: true })
    hashtag: string;
}
