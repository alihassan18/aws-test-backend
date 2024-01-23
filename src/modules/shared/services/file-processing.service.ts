// file-processing.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as readline from 'readline';
import {
    Product,
    ProductDocument
} from 'src/modules/products/entities/product.entity';
import {
    Review,
    ReviewDocument
} from 'src/modules/reviews/entities/review.entity';

@Injectable()
export class FileProcessingService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>
    ) {}

    async readJsonFileLineByLine(
        filePath: string,
        startLine: number,
        endLine: number
    ): Promise<unknown[]> {
        try {
            const readStream = fs.createReadStream(filePath, {
                encoding: 'utf8'
            });
            const rl = readline.createInterface({
                input: readStream,
                crlfDelay: Infinity
            });

            const arr = [];
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const promise = new Promise<unknown[]>((resolve, reject) => {
                let index = 0;
                rl.on('line', (line) => {
                    try {
                        if (index >= startLine && index < endLine) {
                            const jsonData = JSON.parse(line);
                            arr.push(jsonData);
                        }
                        if (index >= endLine - 1) {
                            resolve(arr);
                            rl.close();
                        }
                        index++;
                    } catch (error) {
                        reject(error);
                    }
                });

                rl.on('close', () => {
                    console.log('End of file reached');
                    resolve(arr);
                });

                rl.on('error', (error) => {
                    reject(error);
                });
            });

            return await promise;
        } catch (err) {
            console.error('Error reading/parsing the file:', err);
            throw err;
        }
    }

    async countTotalLines(filePath: string): Promise<number> {
        try {
            const readStream = fs.createReadStream(filePath, {
                encoding: 'utf8'
            });
            const rl = readline.createInterface({
                input: readStream,
                crlfDelay: Infinity
            });

            let lineCount = 0;
            const promise = new Promise<number>((resolve, reject) => {
                rl.on('line', () => {
                    lineCount++;
                });

                rl.on('close', () => {
                    resolve(lineCount);
                });

                rl.on('error', (error) => {
                    reject(error);
                });
            });

            return await promise;
        } catch (err) {
            console.error('Error reading the file:', err);
            throw err;
        }
    }

    async readReviews() {
        try {
            console.log('Reading is start');
            const obj = await this.reviewModel.findOne();
            if (!obj) {
                try {
                    const filePath = 'public/files/reviews.json';
                    const totalLines = await this.countTotalLines(filePath);
                    const BulkCount = 5;
                    for (
                        let index = 0;
                        index < totalLines / BulkCount;
                        index++
                    ) {
                        const result = await this.readJsonFileLineByLine(
                            filePath,
                            index * BulkCount,
                            (index + 1) * BulkCount
                        );
                        await this.reviewModel.insertMany(result);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
            console.log('Reading is end');
        } catch (error) {
            console.log('Error', error);
        }
    }

    async readProducts() {
        try {
            console.log('Reading is start');
            const obj = await this.productModel.findOne();
            if (!obj) {
                try {
                    const filePath = 'public/files/products.json';

                    const totalLines = await this.countTotalLines(filePath);
                    const BulkCount = 5;
                    for (
                        let index = 0;
                        index < totalLines / BulkCount;
                        index++
                    ) {
                        const result = await this.readJsonFileLineByLine(
                            filePath,
                            index * BulkCount,
                            (index + 1) * BulkCount
                        );
                        await this.productModel.insertMany(result);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
            console.log('Reading is end');
        } catch (error) {
            console.log('Error', error);
        }
    }

    async setup() {
        try {
            this.readReviews();
            this.readProducts();
            return true;
        } catch (error) {
            console.log('Error', error);
        }
    }
}
