import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserProfile {
    @Field(() => String, { description: 'Name of the staking collection' })
    userName: string;

    @Field(() => String, { description: 'Name of the staking collection' })
    avatar: string;

    @Field(() => String, { description: 'Name of the staking collection' })
    firstName: string;

    @Field(() => String, { description: 'Name of the staking collection' })
    lastName: string;

    @Field(() => String, { description: 'Name of the staking collection' })
    _id: string;

    @Field(() => Boolean, { description: 'Name of the staking collection' })
    isVerified: boolean;

    @Field(() => Boolean, { description: 'Name of the staking collection' })
    isSCC: boolean;
}
