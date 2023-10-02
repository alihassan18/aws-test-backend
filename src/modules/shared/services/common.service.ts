import { Injectable } from '@nestjs/common';
import { en } from 'src/locales/en';
// import * as Sentry from '@sentry/minimal';

@Injectable()
export class CommonServices {
    public messages = en;
    // constructor() {}

    /**
     * name
     */
    public sendResponse = (mesage, data, status, res) => {
        // console.log(data);
        // if (
        //   [400, 403, 404, 500].includes(status) &&
        //   process.env.ENVIORMENT !== 'development'
        // ) {
        //   Sentry.captureException({ mesage, data, status, res });
        // }
        return res.status(status).json({
            message: mesage,
            data: data
        });
    };

    public async getDataWithPagination(
        model,
        sortBy,
        page,
        pageSize,
        query = {}
    ) {
        const response = {
            metaData: {},
            records: {}
        };
        const filters = [
            {
                $match: query
            },
            {
                $sort: { price: sortBy }
            },
            {
                $skip: (page - 1) * pageSize
            },
            {
                $limit: pageSize
            }
        ];
        return new Promise((resolve, reject) => {
            model
                .aggregate(filters)
                .then((users) => {
                    model
                        .estimatedDocumentCount()
                        .then((count) => {
                            response.metaData = {
                                page,
                                pageSize,
                                totalCount: count,
                                totalPages: Math.ceil(count / pageSize),
                                sortBy
                            };
                            response.records = users;
                            resolve(response);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}
