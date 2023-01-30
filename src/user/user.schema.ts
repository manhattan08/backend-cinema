import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({unique:true})
  email:string
  @Prop()
  password:string
  @Prop({default:false})
  isAdmin:boolean
  @Prop({ default:[], type: MongooseSchema.Types.ObjectId , ref: 'Movies' })
  favorites?: Types.ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User);