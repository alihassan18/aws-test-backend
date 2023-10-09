import { CreateActivityInput } from './create-activities.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateActivityInput extends PartialType(CreateActivityInput) {
    @Field(() => String)
    id: string;
}

@InputType()
export class ActivityFilterInput {
    @Field(() => String, { nullable: true })
    type?: string;
}
