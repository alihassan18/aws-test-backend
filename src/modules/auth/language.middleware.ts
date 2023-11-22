import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as i18n from 'i18n';

@Injectable()
export class LanguageMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const userLanguage = req.headers['accept-language'] || 'en';

        i18n.configure({
            locales: ['en', 'gr'],
            defaultLocale: 'en',
            directory: `${__dirname}/../locales`,
            objectNotation: true
        });
        i18n.setLocale(userLanguage);
        next();
    }
}
