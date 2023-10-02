import { Resolver } from '@nestjs/graphql';
import { IpAddressService } from './ip-address.service';
import { IPAddress } from './entities/ip-address.entity';

@Resolver(() => IPAddress)
export class IpAddressResolver {
    constructor(private readonly ipAddressService: IpAddressService) {}
}
