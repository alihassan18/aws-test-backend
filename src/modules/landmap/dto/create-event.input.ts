import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class EventValueType {
    @Field()
    from: string;

    @Field()
    to: string;

    @Field()
    tokenId: string;
}

@InputType()
export class CreateMrlandEventInput {
    @Field()
    name: string;

    @Field()
    contract: string;

    @Field()
    timestamp: Date;

    @Field()
    blockHash: string;

    @Field()
    blockNumber: number;

    @Field()
    transactionHash: string;

    @Field()
    transactionIndex: number;

    @Field()
    from: string;

    @Field()
    to: string;

    @Field(() => EventValueType)
    values: EventValueType;
}
