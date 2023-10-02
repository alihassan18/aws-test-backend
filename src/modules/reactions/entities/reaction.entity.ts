// entities/reaction.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/entities/user.entity';
import { Post } from 'src/modules/feeds/entities/post.entity';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { USERS } from 'src/constants/db.collections';
import { ReactionType } from '../reactions.enums';
import { Message } from 'src/modules/chat/entities/message.entity';

// Register the enum for GraphQL
registerEnumType(ReactionType, {
    name: 'ReactionType'
});

@ObjectType()
@Schema({ timestamps: true })
export class Reaction extends Document {
    @Field()
    _id: string;

    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: USERS })
    user: Types.ObjectId;

    @Field(() => ReactionType)
    @Prop({ required: true, enum: ReactionType })
    emoji: string;

    @Field(() => String, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: Post.name, default: null })
    post: Types.ObjectId;

    @Field(() => String, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: Message.name, default: null })
    message: Types.ObjectId;
}

export type ReactionDocument = Reaction & Document;
export const ReactionSchema = SchemaFactory.createForClass(Reaction);
