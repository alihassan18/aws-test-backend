import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class HashtagCount {
    @Field()
    name: string;

    @Field()
    count: number;
}

@ObjectType()
export class Last24HrsHashtagCount {
    @Field()
    name: string;

    @Field()
    count: number;

    @Field()
    _id: number;
}
