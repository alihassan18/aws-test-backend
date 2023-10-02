import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRwTutorialsInput {
    @Field(() => String)
    title: string;

    @Field(() => String, { nullable: true })
    description: string;

    @Field(() => String)
    video: string;
}
