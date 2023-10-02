import { Connection } from 'mongoose';
import { Report, ReportSchema } from './report.entity';
export const reportProvider = [
    {
        provide: Report.name,
        useFactory: (connection: Connection) =>
            connection.model(Report.name, ReportSchema),
        inject: ['DATABASE_CONNECTION']
    }
];
