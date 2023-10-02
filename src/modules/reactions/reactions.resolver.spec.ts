import { Test, TestingModule } from '@nestjs/testing';
import { ReactionsResolver } from './reactions.resolver';
import { ReactionService } from './reactions.service';

describe('ReactionsResolver', () => {
    let resolver: ReactionsResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ReactionsResolver, ReactionService]
        }).compile();

        resolver = module.get<ReactionsResolver>(ReactionsResolver);
    });
    console.log('test');

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
