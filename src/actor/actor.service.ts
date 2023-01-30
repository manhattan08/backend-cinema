import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Actor, ActorDocument } from "./actor.schema";
import { Model } from "mongoose";
import { ActorDto } from "./actor.dto";

@Injectable()
export class ActorService {
  constructor(@InjectModel(Actor.name) private readonly actorModel:Model<ActorDocument>) {}

  async bySlug(slug:string){
    const doc = await this.actorModel.findOne({slug}).exec()
    if(!doc) throw new NotFoundException('Actor not found!')
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
          }
        ]
      }
    return this.actorModel.aggregate().match(options).lookup({
      from:'Movies',
      foreignField:'actors',
      localField:'_id',
      as:'moviess'
    }).addFields({
      countMovies:{
        $size:'$movies'
      }
    }).project({
      __v:0,
      updatedAt:0,
      moviess:0
    }).sort({
      createdAt:-1
    }).exec()
  }

  async delete(id:string){
    const deleteActor = await this.actorModel.findByIdAndDelete(id).exec()
    if(!deleteActor) throw new NotFoundException('Actor not found!')
    return deleteActor
  }

  async create(){
    const defaultValue: ActorDto = {
      name:'',
      slug:'',
      photo:''
    }
    const actor = await this.actorModel.create(defaultValue)
    return actor._id
  }

  async update(_id:string,dto:ActorDto){
    const updateActor = await this.actorModel.findByIdAndUpdate(_id,dto,{
      new:true
    }).exec()
    if(!updateActor) throw new NotFoundException('Actor not found!')
    return updateActor
  }

  async byId(_id:string){
    const actor = await this.actorModel.findById(_id)
    if(!actor) throw new NotFoundException('Actor not found!')
    return actor
  }

}
