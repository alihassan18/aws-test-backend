import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRwUsersMediaInput {
    @Field(() => [String], { nullable: true })
    media: string[];

    @Field(() => Boolean, { nullable: true })
    isSS?: boolean;

    @Field(() => Boolean, { nullable: true })
    isSR?: boolean;

    @Field(() => Boolean, { nullable: true })
    isFavourite?: boolean;

    @Field(() => Boolean, { nullable: true })
    isReport?: boolean;

    @Field(() => Boolean, { nullable: true })
    isRepost?: boolean;
}
