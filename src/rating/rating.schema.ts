import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";

export type RatingDocument = Rating & Document;

@Schema()
export class Rating {
  @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'Users' })
  userId: Types.ObjectId

  @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'Movies' })
  movieId: Types.ObjectId

  @Prop()
  value:number

}

export const RatingSchema = SchemaFactory.createForClass(Rating);