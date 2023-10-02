import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateRwEventInput {
    @Field(() => String)
    event_name: string;

    @Field(() => String, { nullable: true })
    event_description: string;

    @Field(() => Date)
    start_date: Date;

    @Field(() => Date)
    end_date: Date;

    @Field(() => String)
    cover_image: string;

    @Field(() => String)
    EventTicketType: string;

    @Field(() => Number, { nullable: true })
    Standard_Price: number;

    @Field(() => Number, { nullable: true })
    Premium_Price: number;

    @Field(() => Number, { nullable: true })
    vipPass_Price: number;

    @Field(() => Number, { nullable: true })
    Max_Tickets: number;

    @Field(() => Number, { nullable: true })
    Available_Tickets_for_Standard: number;

    @Field(() => Number, { nullable: true })
    Available_Tickets_for_Premium: number;

    @Field(() => Number, { nullable: true })
    Available_Tickets_for_VIP: number;

    @Field(() => String, { nullable: true })
    Genre: string;

    @Field(() => String, { nullable: true })
    Location: string;

    @Field(() => String, { nullable: true })
    Blockchain: string;

    @Field(() => String, { nullable: true })
    ArrangedPersonName: string;
}
