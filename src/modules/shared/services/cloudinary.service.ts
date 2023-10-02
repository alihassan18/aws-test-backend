import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

// @Injectable()
// export class CloudinaryService {
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     async uploadImage(
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         fileName: Express.Multer.File
//     ): Promise<UploadApiResponse | UploadApiErrorResponse> {
//         return new Promise((resolve, reject) => {
//             v2.config({
//                 cloud_name: 'dq3jqnrem',
//                 api_key: '489381544782379',
//                 api_secret: 'Q__CwDCL3WG1avdqpd_YJX4_sOU'
//             });
//             const upload = v2.uploader.upload_stream((error, result) => {
//                 if (error) return reject(error);
//                 resolve(result);
//             });
//             toStream(fileName.buffer).pipe(upload);
//         });
//     }
// }

import { Readable } from 'stream'; // Import Readable from stream module

export class CloudinaryService {
    async uploadFile(
        file: Express.Multer.File
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            v2.config({
                cloud_name: 'dq3jqnrem',
                api_key: '489381544782379',
                api_secret: 'Q__CwDCL3WG1avdqpd_YJX4_sOU'
            });

            const uploadStream = v2.uploader.upload_stream(
                { resource_type: 'auto' }, // Set resource_type to 'auto'
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );

            // Create a readable stream from the file buffer
            const fileStream = new Readable();
            fileStream.push(file.buffer);
            fileStream.push(null); // Signals the end of the stream

            // Pipe the file stream to the uploadStream
            fileStream.pipe(uploadStream);
        });
    }
}
