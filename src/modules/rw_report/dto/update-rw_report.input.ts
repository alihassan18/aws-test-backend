import { CreateRwReportInput } from './create-rw_report.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRwReportInput extends PartialType(CreateRwReportInput) {
    @Field(() => Int)
    id: number;
}
