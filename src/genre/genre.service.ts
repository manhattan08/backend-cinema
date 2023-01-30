import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Genre, GenreDocument } from "./genre.schema";
import { CreateGenreDto } from "./dto/create-genre.dto";
import { MovieService } from "../movie/movie.service";
import { Collection } from "./genre.interface";

@Injectable()
export class GenreService {
  constructor(
    @InjectModel(Genre.name) private readonly genreModel: Model<GenreDocument>,
    private readonly movieService:MovieService
  ) {}

  async bySlug(slug:string){
    const doc = await this.genreModel.findOne({slug}).exec()
    if(!doc) throw new NotFoundException('Genre not found!')
    return doc
  }

  async getAll(searchTerm?:string){
    let options = {}
    if(searchTerm)
      options = {
        $or: [
          {
            name: new RegExp(searchTerm,'i')
          },
          {
            slug: new RegExp(searchTerm,'i')
          },
          {
            description: new RegExp(searchTerm,'i')
          }
        ]
      }
    return this.genreModel.find(options).select('-password -updatedAt -__v').sort({
      createdAt:'desc'
    }).exec()
  }

  async delete(id:string){
    const deleteGenre = await this.genreModel.findByIdAndDelete(id).exec()
    if(!deleteGenre) throw new NotFoundException('Genre not found!')
    return deleteGenre
  }

  async create(){
    const defaultValue: CreateGenreDto = {
      name:'',
      slug:'',
      description:'',
      icon:''
    }
    const genre = await this.genreModel.create(defaultValue)
    return genre._id
  }

  async update(_id:string,dto:CreateGenreDto){
    const updateGenre = await this.genreModel.findByIdAndUpdate(_id,dto,{
      new:true
    }).exec()
    if(!updateGenre) throw new NotFoundException('Genre not found!')
    return updateGenre
  }

  async getCollections(){
    const genres = await this.getAll()
    const collections = await Promise.all(genres.map(async genre => {
      const moviesByGenre = await this.movieService.byGenres([genre._id])
      const result:Collection = {
        _id:String(genre._id),
        image:moviesByGenre[0].bigPoster,
        slug:genre.slug,
        title:genre.name
      }
      return result
    }))
    return collections
  }

  async byId(_id:string){
    const genre = await this.genreModel.findById(_id)
    if(!genre) throw new NotFoundException('Genre not found!')
    return genre
  }
}
