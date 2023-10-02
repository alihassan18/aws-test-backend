import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/modules/feeds/dto/create-feed.input';
import { Listing } from '../entities/listing.entity';

@InputType()
export class CreateListingInput {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number;
}

@InputType()
export class FindListingsQuery {
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
export class ListingsResponse {
    @Field(() => [Listing])
    records: Listing[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
}
