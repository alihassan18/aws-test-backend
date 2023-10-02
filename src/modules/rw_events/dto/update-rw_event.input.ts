import { Types } from 'mongoose';
import { CreateRwEventInput } from './create-rw_event.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRwEventInput extends PartialType(CreateRwEventInput) {
    @Field(() => String)
    id: Types.ObjectId;
}

export enum RW_EVENT_TICKET {
    STANDARD,
    PREMIUM,
    VIP
}
