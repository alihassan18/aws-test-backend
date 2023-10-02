import { Resolver } from '@nestjs/graphql';
// import {
//     NotificationFilterInput,
//     NotificationResults
// } from './notification.dto';
import { UsersService } from '../users/users.service';
import { Island } from './entities/island.entity';

@Resolver(() => Island)
export class IslandResolver {
    constructor(private readonly userService: UsersService) {}
}
