import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
    @Field(() => String, { description: 'Name field (placeholder)' })
    name: string;
}

@ObjectType()
export class UserPublicProfile {
    @Field(() => String, { nullable: true })
    _id: string;

    @Field(() => String, { nullable: true })
    userName: string;

    @Field(() => String, { nullable: true })
    avatar: string;

    @Field(() => String, { nullable: true })
    firstName: string;

    @Field(() => String, { nullable: true })
    lastName: string;

    @Field(() => Boolean, { nullable: true })
    isVerified: boolean;

    @Field(() => Boolean, { nullable: true })
    isSCC: boolean;

    @Field(() => Number, { nullable: true })
    followersCount: number;

    @Field(() => Number, { nullable: true })
    followingCount: number;

    @Field(() => Number, { nullable: true })
    recentFollowersCount: number;
}
