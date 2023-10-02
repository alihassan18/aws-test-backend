import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

@Catch()
export class GlobalExceptionFilter implements GqlExceptionFilter {
    catch() {
        // const gqlHost:ArgumentsHost = GqlArgumentsHost.create(host);
        // // const ctx = gqlHost.getContext();
        // const res = gqlHost.getResponse();
        // if (exception instanceof HttpException) {
        //     // Handle HTTP exceptions
        //     const status = exception.getStatus();
        //     const message = exception.message || 'Internal server error';
        //     const code = HttpStatus[status];
        //     const apolloError = new ApolloError(message, code);
        //     res.status(status).json({
        //         errors: [apolloError]
        //     });
        // } else {
        //     // Handle other exceptions
        //     console.error('An error occurred:', exception);
        //     const apolloError = new ApolloError(
        //         'Internal server error',
        //         'INTERNAL_SERVER_ERROR'
        //     );
        //     res.status(500).json({
        //         errors: [apolloError]
        //     });
        // }
    }
}
