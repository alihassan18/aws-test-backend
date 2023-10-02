// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { ObjectType, Field, Int } from '@nestjs/graphql';
// import { Document } from 'mongoose';
// import { FloorAskPrice } from 'src/modules/reservoir/dto/reservoir.objecttypes';

// @ObjectType()
// class Value {
//     @Field(() => Int)
//     @Prop()
//     count: number;

//     @Field()
//     @Prop()
//     value: string;

//     @Field(() => FloorAskPrice)
//     @Prop()
//     floorAskPrice: FloorAskPrice;
// }

// @ObjectType()
// @Schema()
// export class Attribute extends Document {
//     @Field()
//     @Prop()
//     key: string;

//     @Field(() => Int)
//     @Prop()
//     attributeCount: number;

//     @Field()
//     @Prop()
//     kind: string;

//     @Field(() => [Value])
//     @Prop()
//     values: Value[];
// }

// export const AttributeSchema = SchemaFactory.createForClass(Attribute);
