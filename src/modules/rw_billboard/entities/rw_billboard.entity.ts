import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type RwBillBoardDocument = RwBillBoard & Document;

@Schema({ timestamps: true, collection: 'rw_billboards' })
@ObjectType()
export class RwBillBoard {
    @Field(() => [String])
    @Prop({
        type: [String]
    })
    media: string[];

    @Field(() => String)
    @Prop({ type: String })
    location: string;
}

export const RwBillBoardSchema = SchemaFactory.createForClass(RwBillBoard);
