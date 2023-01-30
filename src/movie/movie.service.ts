import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Movie, MovieDocument } from "./movie.schema";
import { CreateMovieDto } from "./create-movie.dto";
import { TelegramService } from "../telegram/telegram.service";

@Injectable()
export class MovieService {
  constructor(
      @InjectModel(Movie.name) private readonly movieModel:Model<MovieDocument>,
      private readonly telegramService:TelegramService
    ) {}

  async bySlug(slug:string){
    const doc = await this.movieModel.findOne({slug}).populate('actors genres').exec()
    if(!doc) throw new NotFoundException('Movie not found!')
    return doc
  }

  async byActor(actorId: Types.ObjectId){
    const docs = await this.movieModel.find({actors:actorId}).exec()
    if(!docs) throw new NotFoundException('Movies not found!')
    return docs
  }

  async byGenres(genreIds: Types.ObjectId[]){
    const docs = await this.movieModel.find({actors:{$in:genreIds}}).exec()
    if(!docs) throw new NotFoundException('Movies not found!')
    return docs
  }

  async getMostPopular(){
    return this.movieModel.find({countOpened:{$gt:0}}).sort({countOpened:-1}).populate('genres').exec()
  }

  async getAll(searchTerm?:string){
    let options = {}
    if(searchTerm)
      options = {
        $or: [
          {
            title: new RegExp(searchTerm,'i')
          }
        ]
      }
    return this.movieModel.find(options).select('-password -updatedAt -__v').sort({
      createdAt:'desc'
    }).populate('actors genres').exec()
  }

  async delete(id:string){
    const deleteMovie = await this.movieModel.findByIdAndDelete(id).exec()
    if(!deleteMovie) throw new NotFoundException('Movie not found!')
    return deleteMovie
  }

  async create(){
    const defaultValue = {
      bigPoster:'',
      actors:[],
      genres: [],
      poster:'',
      title:'',
      videoUrl:'',
      slug:''
    }
    const movie = await this.movieModel.create(defaultValue)
    return movie._id
  }

  async update(_id:string,dto:CreateMovieDto){
    if(!dto.isSendTelegram){
      await this.sendNotification(dto)
      dto.isSendTelegram = true
    }
    const updateMovie = await this.movieModel.findByIdAndUpdate(_id,dto,{
      new:true
    }).exec()
    if(!updateMovie) throw new NotFoundException('Movie not found!')
    return updateMovie
  }

  async updateCountOpened(slug:string){
    const updateMovie = await this.movieModel.findByIdAndUpdate({slug},{
      $inc: {countOpened:1}
    },{new:true}).exec()
    if(!updateMovie) throw new NotFoundException('Movie not found!')
    return updateMovie
  }

  async byId(_id:string){
    const movie = await this.movieModel.findById(_id)
    if(!movie) throw new NotFoundException('Movie not found!')
    return movie
  }

  async updateRating(id:Types.ObjectId,newRating:number){
    return this.movieModel.findByIdAndUpdate(id,{
      rating:newRating
    },{
      new:true
    }).exec()
  }
  async sendNotification(dto:CreateMovieDto){
    if(process.env.NODE_ENV !== 'development')
      await this.telegramService.sendPhoto(dto.poster)
  }
}
