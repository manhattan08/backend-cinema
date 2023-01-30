import { Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Actor, ActorSchema } from "./actor.schema";

@Module({
  imports:[MongooseModule.forFeature([{name: Actor.name,schema:ActorSchema}])],
  providers: [ActorService],
  controllers: [ActorController]
})
export class ActorModule {}
