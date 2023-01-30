import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";

export type MovieDocument = Movie & Document;

export class Parameters {
  @Prop()
  year:number

  @Prop()
  duration:number

  @Prop()
  country:string
}

@Schema()
export class Movie {
  @Prop()
  poster:string

  @Prop({unique:true})
  slug:string

  @Prop()
  videoUrl:string

  @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'Genres' })
  genres: Types.ObjectId

  @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'Actors' })
  actors: Types.ObjectId

  @Prop()
  bigPoster:string

  @Prop()
  title:string

  @Prop()
  parameters?:Parameters

  @Prop({default:4.0})
  rating?:number

  @Prop({default:0})
  countOpened?:number

  @Prop({default:false
  })
  isSendTelegram?:boolean
}

export const MovieSchema = SchemaFactory.createForClass(Movie);