import { Test, TestingModule } from '@nestjs/testing';
import { RwUsersMediaResolver } from './rw_users_media.resolver';
import { RwUsersMediaService } from './rw_users_media.service';

describe('RwUsersMediaResolver', () => {
    let resolver: RwUsersMediaResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwUsersMediaResolver, RwUsersMediaService]
        }).compile();

        resolver = module.get<RwUsersMediaResolver>(RwUsersMediaResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
