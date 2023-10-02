import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Listing } from '../listings/entities/listing.entity';
import { User } from '../users/entities/user.entity';
import { ReportStatus } from './report.enums';
import { Post } from '../feeds/entities/post.entity';
import { Collection } from '../collections/entities/collection.entity';
import { COLLECTIONS, USERS } from 'src/constants/db.collections';
import { Group } from '../chat/entities/group.entity';
import { Nft } from '../nfts/entities/nft.entity';

// Register the enum for GraphQL
registerEnumType(ReportStatus, {
    name: 'ReportStatus'
});

@Schema({ timestamps: true })
@ObjectType()
export class Report extends Document {
    @Field(() => String)
    _id?: string;

    @Field(() => String, { nullable: true })
    @Prop({ type: String })
    text?: string;

    @Field(() => String)
    @Prop()
    reason: string;

    @Field(() => Listing, { nullable: true })
    @Prop({
        type: Types.ObjectId,
        ref: Listing.name,
        default: null,
        index: true
    })
    listing?: Types.ObjectId;

    @Field(() => User)
    @Prop({ type: Types.ObjectId, ref: USERS })
    reportedBy: Types.ObjectId;

    @Field(() => User, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: USERS, default: null, index: true })
    user?: Types.ObjectId;

    @Field(() => Nft, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: Nft.name, default: null, index: true })
    nft?: Types.ObjectId;

    @Field(() => ReportStatus)
    @Prop({ type: String, enum: ReportStatus, default: ReportStatus.REPORTED })
    type: string;

    @Field(() => Post, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: Post.name, default: null, index: true })
    post?: Types.ObjectId;

    @Field(() => Group, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: Group.name, default: null, index: true })
    group?: Types.ObjectId;

    @Field(() => Collection, { nullable: true })
    @Prop({
        type: Types.ObjectId,
        ref: COLLECTIONS,
        default: null,
        index: true
    })
    _collection?: Types.ObjectId;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}

export type ReportDocument = Report & Document;
export const ReportSchema = SchemaFactory.createForClass(Report);
// ReportSchema.index({ reportedBy: 1, post: 1 }, { unique: true });
// ReportSchema.index({ reportedBy: 1, user: 1 }, { unique: true });
// ReportSchema.index({ reportedBy: 1, listing: 1 }, { unique: true });
// ReportSchema.index({ reportedBy: 1, _collection: 1 }, { unique: true });
