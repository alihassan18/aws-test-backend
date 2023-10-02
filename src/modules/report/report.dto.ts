import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

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

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    nft: Types.ObjectId;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    land: Types.ObjectId;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    _collection: Types.ObjectId;
}

// import { createParamDecorator } from '@nestjs/common';
