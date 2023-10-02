import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { Referral } from '../entities/referral.entity';

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
