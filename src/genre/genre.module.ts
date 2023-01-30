import { Module } from '@nestjs/common';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Genre, GenreSchema } from "./genre.schema";
import { MovieModule } from "../movie/movie.module";

@Module({
  imports: [MongooseModule.forFeature([{name: Genre.name,schema:GenreSchema}]),MovieModule],
  controllers: [GenreController],
  providers: [GenreService]
})
export class GenreModule {}
