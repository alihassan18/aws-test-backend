import { CreateIpAddressInput } from './create-ip-address.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateIpAddressInput extends PartialType(CreateIpAddressInput) {
    @Field(() => Int)
    id: number;
}
