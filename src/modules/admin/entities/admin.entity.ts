import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Schema, SchemaFactory } from '@nestjs/mongoose';

export type AdminDocument = Admin & Document;
@Schema()
@ObjectType()
export class Admin {
    @Field(() => Int, { description: 'Example field (placeholder)' })
    exampleField: number;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
