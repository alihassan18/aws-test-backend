import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { PageInfo } from 'src/modules/feeds/dto/create-feed.input';
import { Sales } from '../entities/sales.entity';

@InputType()
export class CreateSalesInput {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number;
}

@InputType()
export class FindSalesQuery {
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
export class SalesResponse {
    @Field(() => [Sales])
    records: Sales[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
}
