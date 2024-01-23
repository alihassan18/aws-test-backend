import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
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
