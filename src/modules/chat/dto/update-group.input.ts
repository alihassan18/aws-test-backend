import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class GroupSettingInput {
    @Field(() => Boolean)
    image: boolean;

    @Field(() => Boolean)
    video: boolean;

    @Field(() => Boolean)
    voice: boolean;

    @Field(() => Boolean)
    files: boolean;

    @Field(() => Boolean)
    gif: boolean;

    @Field(() => Boolean)
    link: boolean;

    @Field(() => Boolean)
    poll: boolean;

    @Field(() => Boolean)
    mute: boolean;
}

@InputType()
export class GroupPrivacyInput {
    @Field(() => Number)
    invite: number;

    @Field(() => Number)
    post: number;

    @Field(() => Number)
    call: number;
}
