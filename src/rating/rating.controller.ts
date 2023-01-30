import { Body, Controller, Get, HttpCode, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { RatingService } from "./rating.service";
import { Auth } from "../auth/decorators/auth.decorator";
import { Types } from "mongoose";
import { Userr } from "../user/decorators/user.decorator";
import { RatingDto } from "./rating.dto";

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService:RatingService) {}

  @Get(':movieId')
  @Auth()
  async getMovieValueByUser(@Param('movieId') movieId:Types.ObjectId,@Userr('_id') _id:Types.ObjectId){
    return this.ratingService.getMovieValueByUser(movieId,_id)
  }

  @UsePipes(new ValidationPipe())
  @Post('set-rating')
  @HttpCode(200)
  @Auth()
  async setRating(@Userr('_id') _id:Types.ObjectId,@Body() dto:RatingDto){
    return this.ratingService.setRating(_id,dto)
  }
}
