import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserProfile {
    @Field(() => String, { nullable: true })
    userName: string;

    @Field(() => String, { nullable: true })
    avatar: string;

    @Field(() => String, { nullable: true })
    firstName: string;

    @Field(() => String, { nullable: true })
    lastName: string;

    @Field(() => String, { nullable: true })
    _id: string;

    @Field(() => Boolean, { nullable: true })
    isVerified: boolean;

    @Field(() => Boolean, { nullable: true })
    isSCC: boolean;
}
