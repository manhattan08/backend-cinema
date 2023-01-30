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
import { Userr } from "../user/decorators/user.decorator";
import { Auth } from "../auth/decorators/auth.decorator";
import { IdValidationPipe } from "../pipes/id.validation.pipe";
import { ActorService } from "./actor.service";
import { ActorDto } from "./actor.dto";

@Controller('actor')
export class ActorController {
  constructor(private readonly actorService:ActorService) {
  }

  @Get('by-slug/:slug')
  async bySlug(@Userr('slug') slug:string){
    return this.actorService.bySlug(slug)
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth('admin')
  async create() {
    return this.actorService.create();
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async update(@Param('id',IdValidationPipe) id:string, @Body() dto:ActorDto) {
    return this.actorService.update(id,dto);
  }

  @Get()
  async getAll(@Query('searchTerm') searchTerm?:string) {
    return this.actorService.getAll(searchTerm);
  }
  @Get(':id')
  @Auth('admin')
  async get(@Param('id') id:string) {
    return this.actorService.byId(id);
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async delete(@Param('id',IdValidationPipe) id:string) {
    return this.actorService.delete(id);
  }
}
