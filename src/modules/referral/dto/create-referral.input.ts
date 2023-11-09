import { InputType, Int, Field, ObjectType, Float } from '@nestjs/graphql';
import { Referral } from '../entities/referral.entity';
import { User } from 'src/modules/users/entities/user.entity';

@InputType()
export class CreateReferralInput {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number;
}

@ObjectType()
export class CreateReferralOutput {
    @Field(() => String, { nullable: true })
    status?: boolean;

    @Field(() => String, { nullable: true })
    message?: string;
}

@ObjectType()
export class ReferralsGraphData {
    @Field(() => Number, { nullable: true })
    count: number;

    @Field(() => Date, { nullable: true })
    createdAt: Date;
}

@ObjectType()
export class ReferralsOutput {
    @Field(() => Referral, { nullable: true })
    affiliatedData: Referral;

    @Field(() => [ReferralsGraphData], { nullable: true })
    graphData: ReferralsGraphData[];
}

@ObjectType()
export class UserReferrals {
    @Field(() => User, { nullable: true })
    user: User;

    @Field(() => Int, { nullable: true })
    buys: number;

    @Field(() => Float, { nullable: true })
    volume: number;

    @Field(() => Float, { nullable: true })
    ourCommission: number;

    @Field(() => Int, { nullable: true })
    affiliateLevel: number;

    @Field(() => Float, { nullable: true })
    yourCommission: number;

    @Field(() => Referral, { nullable: true })
    referral: Referral;
}

@ObjectType()
export class UserRewards {
    @Field(() => Float, { nullable: true })
    rewards: number;

    @Field(() => Float, { nullable: true })
    volume: number;
}
