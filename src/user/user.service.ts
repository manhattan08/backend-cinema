import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "./user.schema";
import { UpdateUserDto } from "./dto/update-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  async byId(_id:string){
    const user = await this.userModel.findById(_id)
    if(!user) throw new NotFoundException('User not found!')

    return user
  }

  async updateProfile(_id:string,dto:UpdateUserDto){
    const user = await this.byId(_id)

    const isSameUser = await this.userModel.findOne({email:dto.email})
    if(isSameUser && String(_id) !== String(isSameUser._id)) throw new NotFoundException('Email busy')
    if(dto.password) {
      user.password = bcrypt.hashSync(dto.password,10)
    }
    user.email = dto.email
    if(dto.isAdmin || dto.isAdmin === false){
      user.isAdmin = dto.isAdmin
    }
    await user.save()
    return
  }

  async getCount(){
    return this.userModel.find().count().exec()
  }

  async getAll(searchTerm?:string){
    let options = {}
    if(searchTerm)
      options = {
        $or: [
          {
            email: new RegExp(searchTerm,'i')
          }
        ]
      }
    return this.userModel.find(options).select('-password -updatedAt -__v').sort({
      createdAt:'desc'
    }).exec()
  }

  async delete(id:string){
    return this.userModel.findByIdAndDelete(id).exec()
  }

  async toggleFavorite(movieId:Types.ObjectId,user){
    const {_id,favorites} = user
    await this.userModel.findByIdAndUpdate(_id,{
      favorites: favorites.includes(movieId)
        ? favorites.filter(id=>String(id) !== String(movieId))
        : [...favorites,movieId]
    })
  }

  async getFavoriteMovies(_id:Types.ObjectId){
    return this.userModel.findById(_id,'favorites').populate({
      path:'favorites',
      populate:{
        path:'genres'
      },
    }).exec().then(data => data.favorites)
  }
}
