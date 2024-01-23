import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
export class Styles {
    @Field(() => String)
    Color: string;

    @Field(() => String)
    Size: string;
}

export type ReviewDocument = Review &
    Document & {
        checkPassword?(password: string): Promise<boolean>;
    };

@Schema({ timestamps: true })
@ObjectType()
export class Review {
    @Field(() => Int)
    @Prop()
    overall: number;

    @Field()
    @Prop()
    verified: boolean;

    @Field()
    @Prop()
    reviewTime: string;

    @Field()
    @Prop()
    reviewerID: string;

    @Field()
    @Prop()
    asin: string;

    @Field(() => Styles, { nullable: true })
    @Prop()
    style?: Styles;

    @Field()
    @Prop()
    reviewerName: string;

    @Field({ nullable: true })
    @Prop()
    reviewText?: string;

    @Field()
    @Prop()
    summary: string;

    @Field(() => Int, { nullable: true })
    @Prop()
    unixReviewTime?: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
