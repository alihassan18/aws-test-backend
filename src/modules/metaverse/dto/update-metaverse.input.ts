import { CreateMetaverseInput } from './create-metaverse.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMetaverseInput extends PartialType(CreateMetaverseInput) {
    @Field(() => String)
    id: string;
}

@InputType()
export class MetaverseFilterInput {
    @Field(() => String, { nullable: true })
    name?: string;
}
