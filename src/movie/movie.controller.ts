import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { Auth } from "../auth/decorators/auth.decorator";
import { IdValidationPipe } from "../pipes/id.validation.pipe";
import { MovieService } from "./movie.service";
import { Types } from "mongoose";
import { CreateMovieDto } from "./create-movie.dto";

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService:MovieService) {
  }

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug:string){
    return this.movieService.bySlug(slug)
  }

  @Get('by-actor/:actorId')
  async byActor(@Param('actorId',IdValidationPipe) actorId:Types.ObjectId){
    return this.movieService.byActor(actorId)
  }

  @UsePipes(new ValidationPipe())
  @Post('by-genres')
  @HttpCode(200)
  async byGenres(@Body('actorId') genreIds:Types.ObjectId[]){
    return this.movieService.byGenres(genreIds)
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth('admin')
  async create() {
    return this.movieService.create();
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async update(@Param('id',IdValidationPipe) id:string, @Body() dto:CreateMovieDto) {
    return this.movieService.update(id,dto);
  }

  @Put('update-count-opened')
  @HttpCode(200)
  async updateCountOpened(@Body() slug:string) {
    return this.movieService.updateCountOpened(slug);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?:string) {
    return this.movieService.getAll(searchTerm);
  }

  @Get('most-popular')
  async getMostPopular() {
    return this.movieService.getMostPopular();
  }

  @Get(':id')
  @Auth('admin')
  async get(@Param('id') id:string) {
    return this.movieService.byId(id);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('id',IdValidationPipe) id:string) {
    return this.movieService.delete(id);
  }
}
