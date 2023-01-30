import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Rating, RatingDocument } from "./rating.schema";
import { MovieService } from "../movie/movie.service";
import { RatingDto } from "./rating.dto";

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(Rating.name) private readonly ratingModel: Model<RatingDocument>,
    private readonly movieService:MovieService
  ) {}

  async getMovieValueByUser(movieId:Types.ObjectId,userId:Types.ObjectId){
    return this.ratingModel.findOne({movieId,userId}).select('value').exec().then(data=>data ? data.value: 0)
  }
  async averageRatingByMovie(movieId:Types.ObjectId | string){
    const ratingsMovie:Rating[] = await this.ratingModel.aggregate().match({
      movieId: new Types.ObjectId(movieId)
    }).exec()

    return ratingsMovie.reduce((acc,item)=> acc+item.value,0)/ratingsMovie.length
  }
  async setRating(userId:Types.ObjectId,dto:RatingDto){
    const {movieId,value} = dto

    const newRating = await this.ratingModel.findOneAndUpdate({movieId,userId},{
      movieId,userId,value
    },{
      new:true,
      upset:true,
      setDefaultsOnInsert:true
    }).exec()
    const averageRating = await this.averageRatingByMovie(movieId)

    await this.movieService.updateRating(movieId,averageRating)

    return newRating
  }
}
