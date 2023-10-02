import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { RwSettingsService } from './rw_settings.service';
import { RwSettings } from './entities/rw_setting.entity';
import { UpdateRwSettingInput } from './dto/update-rw_setting.input';
import { AuthGuard } from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { ContextProps } from 'src/interfaces/common.interface';

@Resolver(() => RwSettings)
export class RwSettingsResolver {
    constructor(private readonly rwSettingsService: RwSettingsService) {}

    @Mutation(() => RwSettings)
    @UseGuards(AuthGuard)
    rw_settingsUpdate(
        @Args('updateRwSettingInput')
        updateRwSettingInput: UpdateRwSettingInput,
        @Context() ctx: ContextProps
    ) {
        const { _id } = ctx.req.user;
        return this.rwSettingsService.update(updateRwSettingInput, _id);
    }

    @Query(() => RwSettings)
    @UseGuards(AuthGuard)
    rw_settings(@Context() ctx: ContextProps) {
        const { _id } = ctx.req.user;
        return this.rwSettingsService.findOne(_id);
    }
}
