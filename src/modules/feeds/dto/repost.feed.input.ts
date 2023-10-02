import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreatePostInput } from './create-feed.input';

@InputType()
export class RepostInput extends PartialType(CreatePostInput) {
    @Field(() => ID)
    postId: string;
}
