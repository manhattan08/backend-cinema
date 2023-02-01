import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { getJWTConfig } from "../config/jwt.config";

@Module({
  imports: [ConfigModule,UserModule,JwtModule.registerAsync({
    imports:[ConfigModule],
    inject:[ConfigService],
    useFactory:getJWTConfig
  })],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
})
export class AuthModule {}
