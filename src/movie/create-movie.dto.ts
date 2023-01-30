import { IsArray, IsBoolean, IsNumber, IsObject, IsString } from "class-validator";
import { Parameters } from "./movie.schema";

export class CreateMovieDto {
  @IsNumber()
  year:number

  @IsNumber()
  duration:number

  @IsNumber()
  country:string

  @IsString()
  poster:string

  @IsString()
  slug:string

  @IsString()
  videoUrl:string

  @IsArray()
  @IsString({each:true})
  genres:string[]

  @IsArray()
  @IsString({each:true})
  actors:string[]

  @IsString()
  bigPoster:string

  @IsString()
  title:string

  @IsObject()
  parameters?:Parameters

  @IsBoolean()
  isSendTelegram?:boolean
}