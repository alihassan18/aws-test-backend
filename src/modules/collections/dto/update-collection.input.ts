import { CreateCollectionInput } from './create-collection.input';
import { InputType, Field, PartialType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCollectionInput extends PartialType(CreateCollectionInput) {
    @Field(() => String)
    id: string;

    @Field(() => Int, {
        description: 'Chain id field (placeholder)',
        nullable: true
    })
    chainId: number;

    @Field(() => String, {
        description: 'Name field (placeholder)',
        nullable: true
    })
    name: string;

    @Field(() => String, {
        description: 'Contract address field (placeholder)',
        nullable: true
    })
    contract: string;

    @Field(() => String, {
        description: 'Chain name field (placeholder)',
        nullable: true
    })
    chain: string;
}
