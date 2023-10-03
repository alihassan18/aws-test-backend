import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class CreateRwFightLbInput {
    @Field(() => String)
    email: string;

    @Field(() => String)
    name: string;

    @Field(() => Number)
    damage: number;

    // @Field(() => Number)
    // dailydamage: number;

    // @Field(() => Number)
    // weeklydamage: number;

    // @Field(() => Number)
    // monthlydamage: number;

    // @Field(() => Number)
    // yearlydamage: number;

    @Field(() => Number)
    deathTime: number;

    @Field(() => Number)
    updateTime: number;
}

@ObjectType()
export class RwFightLbResponse {
    @Field()
    _id: string;

    @Field(() => String)
    email: string;

    @Field(() => String)
    name: string;

    @Field(() => Number)
    damage: number;

    @Field(() => Number)
    deathTime: number;

    @Field(() => Number)
    updateTime: number;

    @Field(() => Boolean)
    isVerified: boolean;
}
