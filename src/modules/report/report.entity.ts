import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Listing } from '../listings/entities/listing.entity';
import { User } from '../users/entities/user.entity';
import { ReportStatus } from './report.enums';
import { Post } from '../feeds/entities/post.entity';
import { USERS } from 'src/constants/db.collections';
import { Group } from '../chat/entities/group.entity';

// Register the enum for GraphQL
registerEnumType(ReportStatus, {
    name: 'ReportStatus'
});

@ObjectType()
@Schema()
class CollectionReportType {
    @Field(() => String, { nullable: true })
    @Prop({ type: String })
    contract?: string;

    @Field(() => String, { nullable: true })
    @Prop(String)
    chain: string;

    @Field(() => String, { nullable: true })
    @Prop(String)
    image?: string;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean })
    isBlocked?: boolean;
}

@ObjectType()
@Schema()
class NFTReportType {
    @Field(() => String, { nullable: true })
    @Prop({ type: String })
    contract?: string;

    @Field(() => String, { nullable: true })
    @Prop(String)
    chain: string;

    @Field(() => String, { nullable: true })
    @Prop(String)
    image?: string;

    @Field({ nullable: true })
    @Prop(String)
    tokenId: string;

    @Field(() => Boolean, { nullable: true })
    @Prop({ type: Boolean })
    isBlocked?: boolean;
}

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

    // @Field(() => Nft, { nullable: true })
    // @Prop({ type: Types.ObjectId, ref: Nft.name, default: null, index: true })
    // nft?: Types.ObjectId;

    @Field(() => NFTReportType, { nullable: true })
    @Prop(NFTReportType)
    nft?: NFTReportType;

    @Field(() => ReportStatus)
    @Prop({ type: String, enum: ReportStatus, default: ReportStatus.REPORTED })
    type: string;

    @Field(() => Post, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: Post.name, default: null, index: true })
    post?: Types.ObjectId;

    @Field(() => Group, { nullable: true })
    @Prop({ type: Types.ObjectId, ref: Group.name, default: null, index: true })
    group?: Types.ObjectId;

    // @Field(() => Collection, { nullable: true })
    // @Prop({
    //     type: Types.ObjectId,
    //     ref: COLLECTIONS,
    //     default: null,
    //     index: true
    // })
    // _collection?: Types.ObjectId;

    @Field(() => CollectionReportType, { nullable: true })
    @Prop(CollectionReportType)
    _collection?: CollectionReportType;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;
}

export type ReportDocument = Report & Document;
export const ReportSchema = SchemaFactory.createForClass(Report);
