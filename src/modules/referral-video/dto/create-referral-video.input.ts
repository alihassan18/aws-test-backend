import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateReferralVideoInput {
    @Field(() => String)
    src: number;
}

@ObjectType()
export class ReferralsVideoResult {
    @Field(() => Number, { nullable: true })
    count: number;

    @Field(() => Date, { nullable: true })
    createdAt: Date;
}
