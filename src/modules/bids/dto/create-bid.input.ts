import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/modules/feeds/dto/create-feed.input';
import { Bid } from '../entities/bid.entity';

@InputType()
export class CreateBidInput {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number;
}

@InputType()
export class FindBidsQuery {
    @Field(() => String, { description: 'Contract address of the collection.' })
    contract: string;

    @Field(() => Int, {
        description: 'Contract address of the collection.',
        defaultValue: 20,
        nullable: true
    })
    pageSize: number;

    @Field(() => Int, {
        description: 'Contract address of the collection.',
        defaultValue: 1,
        nullable: true
    })
    page: number;
}

@ObjectType()
export class BidsResponse {
    @Field(() => [Bid])
    records: Bid[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
}
