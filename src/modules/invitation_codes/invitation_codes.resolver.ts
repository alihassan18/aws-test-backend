import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { InvitationCodesService } from './invitation_codes.service';
import { InvitationCode } from './entities/invitation_code.entity';
import { CreateInvitationCodeInput } from './dto/create-invitation_code.input';
import { UpdateInvitationCodeInput } from './dto/update-invitation_code.input';
import { AuthGuard } from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { ContextProps } from 'src/interfaces/common.interface';

@Resolver(() => InvitationCode)
export class InvitationCodesResolver {
    constructor(
        private readonly invitationCodesService: InvitationCodesService
    ) {}

    @Mutation(() => InvitationCode)
    @UseGuards(AuthGuard)
    createInvitationCode(
        @Args('createInvitationCodeInput')
        createInvitationCodeInput: CreateInvitationCodeInput,
        @Context() ctx: ContextProps
    ) {
        const { _id, userName } = ctx.req.user;
        return this.invitationCodesService.create(
            createInvitationCodeInput,
            _id,
            userName
        );
    }

    @Query(() => [InvitationCode], { name: 'invitationCodes' })
    findAll() {
        return this.invitationCodesService.findAll();
    }

    @Query(() => InvitationCode, { name: 'invitationCode' })
    findOne(@Args('id', { type: () => Int }) id: number) {
        return this.invitationCodesService.findOne(id);
    }

    @Mutation(() => InvitationCode)
    updateInvitationCode(
        @Args('updateInvitationCodeInput')
        updateInvitationCodeInput: UpdateInvitationCodeInput
    ) {
        return this.invitationCodesService.update(updateInvitationCodeInput.id);
    }

    @Mutation(() => InvitationCode)
    removeInvitationCode(@Args('id', { type: () => Int }) id: number) {
        return this.invitationCodesService.remove(id);
    }
}
