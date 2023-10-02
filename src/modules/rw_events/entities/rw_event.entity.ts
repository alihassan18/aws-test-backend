import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RW_EVENT_TICKET } from '../dto/update-rw_event.input';

export type RwEventDocument = RwEvent & Document;

@Schema({ timestamps: true, collection: 'rw_events' })
@ObjectType()
export class RwEvent {
    @Field()
    _id: string;

    @Field(() => String)
    @Prop({
        type: String
    })
    event_name: string;

    @Field(() => String, { nullable: true })
    @Prop({
        type: String
    })
    event_description: string;

    @Field(() => Date)
    @Prop({
        type: Date
    })
    start_date: Date;

    @Field(() => Date)
    @Prop({
        type: Date
    })
    end_date: Date;

    @Field(() => String)
    @Prop({
        type: String
    })
    cover_image: string;

    @Field(() => String)
    @Prop({
        type: String,
        default: RW_EVENT_TICKET.STANDARD,
        enum: RW_EVENT_TICKET
    })
    EventTicketType: string;

    @Field(() => Number, { nullable: true })
    @Prop({ type: Number })
    Standard_Price: number;

    @Field(() => Number, { nullable: true })
    @Prop({ type: Number })
    Premium_Price: number;

    @Field(() => Number, { nullable: true })
    @Prop({ type: Number })
    vipPass_Price: number;

    @Field(() => Number, { nullable: true })
    @Prop({ type: Number })
    Max_Tickets: number;

    @Field(() => Number, { nullable: true })
    @Prop({ type: Number })
    Available_Tickets_for_Standard: number;

    @Field(() => Number, { nullable: true })
    @Prop({ type: Number })
    Available_Tickets_for_Premium: number;

    @Field(() => Number, { nullable: true })
    @Prop({ type: Number })
    Available_Tickets_for_VIP: number;

    @Field(() => String, { nullable: true })
    @Prop({
        type: String
    })
    Genre: string;

    @Field(() => String, { nullable: true })
    @Prop({
        type: String
    })
    Location: string;

    @Field(() => String, { nullable: true })
    @Prop({
        type: String
    })
    Blockchain: string;

    @Field(() => String, { nullable: true })
    @Prop({
        type: String
    })
    ArrangedPersonName: string;

    @Field(() => Number, { nullable: true })
    @Prop({ type: Number })
    Remaining_Days: number;
}

export const RwEventSchema = SchemaFactory.createForClass(RwEvent);
