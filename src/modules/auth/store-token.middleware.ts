import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class StoreTokenMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (req.query.token) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            req.session.token = req.query.token;
        }
        next();
    }
}
