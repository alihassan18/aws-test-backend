import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPAddress, IPAddressDocument } from './entities/ip-address.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class IpAddressService {
    constructor(
        @InjectModel(IPAddress.name)
        readonly IPAddressModel: Model<IPAddressDocument>
    ) {}

    async create(user: Types.ObjectId, ipAddress?: string) {
        try {
            if (!ipAddress) return;

            const isPresent = await this.IPAddressModel.findOne({
                user,
                ip_address: ipAddress
            });
            if (isPresent) {
                return;
            } else {
                await this.IPAddressModel.create({
                    user,
                    ip_address: ipAddress
                });
            }
        } catch (error) {
            console.log(error, 'error in IP service');
        }
    }
}
