import { Test, TestingModule } from '@nestjs/testing';
import { RwUsersMediaService } from './rw_users_media.service';

describe('RwUsersMediaService', () => {
    let service: RwUsersMediaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RwUsersMediaService]
        }).compile();

        service = module.get<RwUsersMediaService>(RwUsersMediaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
