import { InputType, Int, Field, ObjectType } from '@nestjs/graphql';
import { Reaction } from '../entities/reaction.entity';

@InputType()
export class CreateReactionInput {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number;
}

@ObjectType()
export class GetTopReactions {
    @Field(() => String, { description: 'Example field (placeholder)' })
    emoji: string;

    @Field(() => Int, { description: 'Example field (placeholder)' })
    count: number;
}

@ObjectType()
export class GetReactions {
    @Field(() => [Reaction], { description: 'Example field (placeholder)' })
    reactions: Reaction[];

    @Field(() => String, {
        description: 'Example field (placeholder)',
        nullable: true
    })
    endCursor: string;
}
