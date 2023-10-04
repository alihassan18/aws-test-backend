import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

@InputType()
class NFTReport {
    @Field(() => String, { nullable: true })
    contract?: string;

    @Field(() => String, { nullable: true })
    chain: string;

    @Field(() => String, { nullable: true })
    image?: string;

    @Field({ nullable: true })
    tokenId: string;
}
@InputType()
class CollectionReport {
    @Field(() => String, { nullable: true })
    contract?: string;

    @Field(() => String, { nullable: true })
    chain: string;

    @Field(() => String, { nullable: true })
    image?: string;
}
@InputType()
export class CreateReportDto {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    text: string;

    @Field(() => String)
    @IsString()
    reason: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    post: Types.ObjectId;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    group: Types.ObjectId;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    user: Types.ObjectId;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    listing: Types.ObjectId;

    @Field(() => NFTReport, { nullable: true })
    nft: NFTReport;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    land: Types.ObjectId;

    @Field(() => CollectionReport, { nullable: true })
    _collection: CollectionReport;
}

// import { createParamDecorator } from '@nestjs/common';
