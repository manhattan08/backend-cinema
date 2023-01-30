import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ActorDocument = Actor & Document;

@Schema()
export class Actor  {
  @Prop()
  name:string
  @Prop({unique:true})
  slug:string
  @Prop()
  photo:string
}

export const ActorSchema = SchemaFactory.createForClass(Actor);