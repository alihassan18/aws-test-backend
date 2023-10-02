import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRwGameFlowerInput {
    @Field(() => String)
    flowerValue: string;

    @Field(() => Boolean, { nullable: true })
    isDaily?: boolean;

    // @Field(() => Date)
    // openAt: Date;
}
