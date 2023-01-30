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
import { Userr } from "../user/decorators/user.decorator";
import { UpdateUserDto } from "../user/dto/update-user.dto";
import { IdValidationPipe } from "../pipes/id.validation.pipe";
import { GenreService } from "./genre.service";
import { CreateGenreDto } from "./dto/create-genre.dto";

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService:GenreService) {}

  @Get('by-slug/:slug')
  async bySlug(@Userr('slug') slug:string){
    return this.genreService.bySlug(slug)
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth('admin')
  async create() {
    return this.genreService.create();
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async update(@Param('id',IdValidationPipe) id:string, @Body() dto:CreateGenreDto) {
    return this.genreService.update(id,dto);
  }

  @Get('/collections')
  async getCollections() {
    return this.genreService.getCollections();
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?:string) {
    return this.genreService.getAll(searchTerm);
  }
  @Get(':id')
  @Auth('admin')
  async get(@Param('id') id:string) {
    return this.genreService.byId(id);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('id',IdValidationPipe) id:string) {
    return this.genreService.delete(id);
  }
}
