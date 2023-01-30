import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type GenreDocument = Genre & Document;

@Schema()
export class Genre {
  @Prop()
  name:string
  @Prop({unique:true})
  slug:string
  @Prop()
  description:string
  @Prop()
  icon:string
}

export const GenreSchema = SchemaFactory.createForClass(Genre);