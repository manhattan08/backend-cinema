import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.schema";

@Module({
  imports: [MongooseModule.forFeature([{name: User.name,schema:UserSchema}])],
  providers: [UserService],
  controllers: [UserController],
  exports: [MongooseModule.forFeature([{name: User.name,schema:UserSchema}])]
})
export class UserModule {}
