import { InputType, Int, Field } from '@nestjs/graphql';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
@InputType()
export class CreateAuthInput {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number;
}

export const IpAddress = createParamDecorator(
    (data, context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req.ip;
    }
);

// export class UpdateKycVerifyStatus {
//     @IsNotEmpty()
//     code: any;
//     @IsNotEmpty()
//     vendorData: any;
// }

// export class KycVerifyComplete {
//     @IsNotEmpty()
//     verification: any;
// }
