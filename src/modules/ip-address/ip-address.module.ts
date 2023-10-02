import { Module } from '@nestjs/common';
import { IpAddressService } from './ip-address.service';
import { IpAddressResolver } from './ip-address.resolver';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [CommonModule],
    providers: [IpAddressResolver, IpAddressService]
})
export class IpAddressModule {}
