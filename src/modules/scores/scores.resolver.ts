import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { Score } from './entities/score.entity';
import { ScoresService } from './scores.service';
import { UseGuards } from '@nestjs/common';
import { ContextProps } from 'src/interfaces/common.interface';
import { ActionType } from './scores.enum';
import { AuthGuard } from '../auth/auth.guard';
import { HighScoreResult, ScoresResult } from './scores.dto';

@Resolver(() => Score)
export class ScoresResolver {
    constructor(
        private readonly scoreService: ScoresService,
        private readonly userService: UsersService
    ) {}

    @UseGuards(AuthGuard)
    @Query(() => [ScoresResult])
    async getMonthTopScore(): Promise<ScoresResult[]> {
        return await this.scoreService.getMonthTopScores();
    }

    @UseGuards(AuthGuard)
    @Query(() => [ScoresResult])
    async getMonthScore(): Promise<ScoresResult[]> {
        return await this.scoreService.getMonthScores();
    }

    @UseGuards(AuthGuard)
    @Query(() => ScoresResult)
    async getUserMonthScore(
        @Context() context: ContextProps
    ): Promise<ScoresResult> {
        const { _id: userId } = context.req.user;
        return await this.scoreService.getUserMonthScore(userId);
    }

    @UseGuards(AuthGuard)
    async createScore(
        @Args('action', { type: () => String }) action: ActionType,
        @Context() context: ContextProps
    ): Promise<void> {
        const { _id: userId } = context.req.user;
        return await this.scoreService.createScore(userId, action);
    }

    @Query(() => HighScoreResult)
    async highestScore(): Promise<HighScoreResult> {
        return await this.scoreService.highestScore();
    }
}
