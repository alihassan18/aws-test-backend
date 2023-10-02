import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AnimationChrObject {
    @Field(() => String)
    animation: string;

    @Field(() => String)
    slot: string;
}

@InputType()
export class TicketsChrObject {
    @Field(() => String)
    ticket: string;

    @Field(() => String)
    slot: string;
}
@InputType()
export class CreateRwCharacterInput {
    @Field(() => String, { nullable: true })
    skinColor?: string;

    @Field(() => String, { nullable: true })
    gender?: string;

    @Field(() => String)
    backpack?: string;

    @Field(() => String, { nullable: true })
    Hat?: string;

    @Field(() => String, { nullable: true })
    Torso?: string;

    @Field(() => String, { nullable: true })
    Pant?: string;

    @Field(() => String, { nullable: true })
    Shoes?: string;

    @Field(() => String, { nullable: true })
    Glasses?: string;

    @Field(() => String, { nullable: true })
    Golves?: string;

    @Field(() => String, { nullable: true })
    Belt?: string;

    @Field(() => [AnimationChrObject], { nullable: true })
    AnimationSlots?: AnimationChrObject[];

    @Field(() => [TicketsChrObject], { nullable: true })
    Tickets?: TicketsChrObject[];
}
