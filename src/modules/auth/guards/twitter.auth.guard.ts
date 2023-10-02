import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TwitterAuthGuard extends AuthGuard('twitter') {
    constructor() {
        super();
    }

    // Override handleRequest method
    handleRequest(err, user, info, context: ExecutionContext) {
        console.log(err, user, info, context);

        // const req = context.switchToHttp().getRequest();

        // // Access the req object
        // console.log(req, 'req');

        // Call the base class handleRequest method
        return super.handleRequest(err, user, info, context);
    }
}
