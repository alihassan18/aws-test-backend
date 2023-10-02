import { ObjectType, Field, InputType } from '@nestjs/graphql';
import { Notification } from './entities/notification.entity';

@ObjectType()
export class NotificationResults {
    @Field(() => [Notification])
    records: Notification[];

    @Field({ nullable: true })
    hasNextPage: boolean;

    @Field({ nullable: true })
    cursor: string;

    @Field({ nullable: true })
    totalRecords: number;

    @Field({ nullable: true })
    recordsFilterd: number;

    @Field({ nullable: true })
    allNotifications: number;

    @Field({ nullable: true })
    mentionedNotifications: number;

    @Field({ nullable: true })
    personalNotificationsCount: number;

    @Field({ nullable: true })
    systemNotificatiosCount: number;

    @Field({ nullable: true })
    nftNotificationsCount: number;
}

@InputType()
export class NotificationFilterInput {
    @Field({ nullable: true })
    mentioned: boolean;

    @Field({ nullable: true })
    personal: boolean;

    @Field({ nullable: true })
    nft: boolean;

    @Field({ nullable: true })
    system: boolean;
}
