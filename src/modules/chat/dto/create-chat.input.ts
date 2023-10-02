import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { Message } from '../entities/message.entity';

@InputType()
export class CreateChatInput {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number;
}

@InputType()
export class CreateGroupMessageInput {
    @Field(() => String, { nullable: true })
    _id?: string;

    @Field(() => String, { nullable: true })
    receiverGroup?: string;

    @Field(() => [String], {
        description: 'Media field (placeholder)',
        nullable: true
    })
    attachment?: string[];

    @Field(() => String, { nullable: true })
    content?: string;

    @Field(() => String, { nullable: true })
    inReplyToMessage?: string;

    @Field(() => Date, { nullable: true })
    createdAt?: Date;
}

@InputType()
export class CreatePrivateMessageInput {
    @Field(() => String, { nullable: true })
    _id?: string;

    @Field(() => String, { nullable: true })
    receiverUser?: string;

    @Field(() => [String], {
        description: 'Media field (placeholder)',
        nullable: true
    })
    attachment?: string[];

    @Field(() => String, { nullable: true })
    content?: string;

    @Field(() => String, { nullable: true })
    inReplyToMessage?: string;

    @Field(() => Date, { nullable: true })
    createdAt?: Date;
}

@ObjectType()
export class MessageInfo {
    @Field(() => Boolean)
    hasNextPage: boolean;

    @Field(() => String, { nullable: true })
    endCursor?: string | null;
}
@ObjectType()
export class MessageConnection {
    @Field(() => [Message])
    records: Message[];

    @Field(() => MessageInfo)
    pageInfo: MessageInfo;

    @Field(() => Number)
    totalMessagesCount: number;
}
