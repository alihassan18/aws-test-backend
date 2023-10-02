// src/interceptors/graphql-cache.interceptor.ts
import {
    CACHE_MANAGER,
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class GraphqlCacheInterceptor implements NestInterceptor {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<unknown>> {
        const gqlContext = GqlExecutionContext.create(context);
        const info = gqlContext.getInfo();

        const cacheKey = this.generateCacheKey(
            info.parentType,
            info.fieldName,
            info.variableValues
        );

        const cachedData = await this.cacheManager.get(cacheKey);

        if (cachedData) {
            return of(cachedData); // Wrap the cached data in an Observable using 'of'
        }

        return next.handle().pipe(
            tap(async (data) => {
                // console.log(data, cacheKey);

                // Set a TTL for the cache entry, e.g., 5 minutes (300 seconds)
                const ttl = 300;

                await this.cacheManager.set(cacheKey, data, ttl);
            })
        );
    }

    private generateCacheKey(
        parentType: string,
        fieldName: string,
        variables: object
    ): string {
        const sortedVariables = Object.entries(variables)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, value]) => `${key}:${value}`)
            .join('&');

        return `gqlcache:${parentType}:${fieldName}:${sortedVariables}`;
    }

    // Method for manual cache invalidation
    async invalidateCache(
        parentType: string,
        fieldName: string,
        variables: object
    ): Promise<void> {
        const cacheKey = this.generateCacheKey(
            parentType,
            fieldName,
            variables
        );
        await this.cacheManager.del(cacheKey); // Delete the cache entry with the given cacheKey
    }
}
