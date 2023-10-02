import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRwRaceLbInput {
    @Field(() => String)
    email: string;

    @Field(() => String)
    name: string;

    @Field(() => Number)
    laptime: number;

    // @Field(() => Number)
    // dailylaptime: number;

    // @Field(() => Number)
    // weeklylaptime: number;

    // @Field(() => Number)
    // monthlylaptime: number;

    // @Field(() => Number)
    // yearlylaptime: number;

    @Field(() => Number)
    updateTime: number;
}
