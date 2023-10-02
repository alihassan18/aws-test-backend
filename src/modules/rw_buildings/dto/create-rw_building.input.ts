import { InputType, Field } from '@nestjs/graphql';
import { Types } from 'mongoose';

@InputType()
export class CreateRwBuildingInput {
    @Field(() => String)
    title: string;

    @Field(() => String)
    desc: string;

    @Field(() => [String])
    title_images: string[];

    @Field(() => [String], { nullable: true })
    nft_images?: string[];

    @Field(() => String)
    ubindex: string;
}

@InputType()
export class CreateRwBuildingTypesInput {
    @Field(() => String, { nullable: true })
    id?: Types.ObjectId;

    @Field(() => String)
    name: string;

    @Field(() => String)
    index: string;

    @Field(() => Number)
    bigImages: number;

    @Field(() => Number)
    smallImages: number;

    @Field(() => Boolean)
    assigned: boolean;
}
