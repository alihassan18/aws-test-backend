import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Auth {
    @Field(() => String, { nullable: true })
    email?: string;
    @Field(() => String, { nullable: true })
    userName?: string;
    @Field(() => String, { nullable: true })
    phoneNumber?: string;
    @Field(() => String, { nullable: true })
    referral?: string;
    @Field(() => String)
    password: string;
}
