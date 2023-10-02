import { Test, TestingModule } from '@nestjs/testing';
import { IpAddressResolver } from './ip-address.resolver';
import { IpAddressService } from './ip-address.service';

describe('IpAddressResolver', () => {
    let resolver: IpAddressResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [IpAddressResolver, IpAddressService]
        }).compile();

        resolver = module.get<IpAddressResolver>(IpAddressResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
