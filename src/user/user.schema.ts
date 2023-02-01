import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { Movie } from "../movie/movie.schema";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({unique:true})
  email:string
  @Prop()
  password:string
  @Prop({default:false})
  isAdmin:boolean
  @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'Movie' })
  favorites?: Movie[]
}

export const UserSchema = SchemaFactory.createForClass(User);