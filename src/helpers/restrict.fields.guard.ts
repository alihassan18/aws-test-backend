// import {
//     Injectable,
//     CanActivate,
//     ExecutionContext,
//     BadRequestException
// } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';

// @Injectable()
// export class RestrictGuard implements CanActivate {
//     constructor(private readonly restrictArray: string[]) {}

//     canActivate(context: ExecutionContext): boolean {
//         const ctx = GqlExecutionContext.create(context);
//         const request = ctx.getContext().req;
//         if (
//             this.restrictArray &&
//             this.restrictArray.length > 0 &&
//             this.restrictArray.some((requiredRole) =>
//                 request?.body.query.includes(requiredRole)
//             )
//         ) {
//             throw new BadRequestException(
//                 `You cannot access the fields ${this.restrictArray}`
//             );
//         } else {
//             return true;
//         }
//     }
// }
