import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Movie, MovieSchema } from "./movie.schema";
import { TelegramModule } from "../telegram/telegram.module";

@Module({
  imports: [MongooseModule.forFeature([{name: Movie.name,schema:MovieSchema}]),TelegramModule],
  controllers: [MovieController],
  providers: [MovieService],
  exports:[MovieService]
})
export class MovieModule {}
