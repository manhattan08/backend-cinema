import { Body, Controller, Delete, Get, HttpCode, Param, Put, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { Auth } from "../auth/decorators/auth.decorator";
import { Userr } from "./decorators/user.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IdValidationPipe } from "../pipes/id.validation.pipe";
import { Types } from "mongoose";
import { User } from "./user.schema";

@Controller('user')
export class UserController {
  constructor(private readonly userService:UserService) {}

  @Get('profile')
  @Auth()
  async getProfile(@Userr('_id') _id:string){
    return this.userService.byId(_id)
  }

  @UsePipes(new ValidationPipe())
  @Put('profile')
  @HttpCode(200)
  @Auth()
  async updateProfile(@Userr('_id') _id:string, @Body() dto:UpdateUserDto) {
    return this.userService.updateProfile(_id,dto);
  }

  @Get('profile/favorites')
  @Auth()
  async getFavorites(@Userr('_id') _id:Types.ObjectId){
    return this.userService.getFavoriteMovies(_id)
  }

  @Put('profile/favorites')
  @HttpCode(200)
  @Auth()
  async toggleFavorites(@Body('movieId',IdValidationPipe) movieId:Types.ObjectId,@Userr() user: User) {
    return this.userService.updateProfile(String(movieId),user);
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateUser(@Param('id',IdValidationPipe) id:string, @Body() dto:UpdateUserDto) {
    return this.userService.updateProfile(id,dto);
  }

  @Get('count')
  @Auth('admin')
  async getCountUsers() {
    return this.userService.getCount();
  }

  @Get()
  @Auth('admin')
  async getUsers(@Query('searchTerm') searchTerm?:string) {
    return this.userService.getAll(searchTerm);
  }

  @Get(':id')
  @Auth('admin')
  async getUser(@Param('id',IdValidationPipe) id:string) {
    return this.userService.byId(id);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteUser(@Param('id',IdValidationPipe) id:string) {
    return this.userService.delete(id);
  }


}
