import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class HashtagCount {
    @Field()
    name: string;

    @Field()
    count: number;
}
