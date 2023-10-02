// src/interceptors/logging.interceptor.ts
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<unknown> {
        const gqlContext = GqlExecutionContext.create(context);
        const info = gqlContext.getInfo();
        const now = Date.now();

        console.log(`Before: ${info.fieldName}`);

        return next.handle().pipe(
            tap(() => {
                const elapsedTime = Date.now() - now;
                console.log(`After: ${info.fieldName} - ${elapsedTime}ms`);
            })
        );
    }
}
