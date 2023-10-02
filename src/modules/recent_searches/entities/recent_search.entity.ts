import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Collection } from 'src/modules/collections/entities/collection.entity';
import { Hashtag } from 'src/modules/feeds/entities/hashtag.entity';
import { User } from 'src/modules/users/entities/user.entity';

export type RecentSearchDocument = RecentSearch & Document;

@Schema({ timestamps: true, collection: 'recent_searches' })
@ObjectType()
export class RecentSearch {
    @Field(() => String, { nullable: true })
    _id?: string;

    @Field(() => Collection, { nullable: true })
    @Prop({
        type: Types.ObjectId,
        ref: 'Collection'
    })
    _collection: Types.ObjectId;

    @Field(() => User, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'User' })
    user: Types.ObjectId;

    @Field(() => User, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: 'User' })
    userToSearch: Types.ObjectId;

    @Field(() => Hashtag, { nullable: true })
    @Prop({ type: String })
    hashtag: string;
}

export const RecentSearchSchema = SchemaFactory.createForClass(RecentSearch);
