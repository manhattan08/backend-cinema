import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../../user/user.schema";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService:ConfigService,
    @InjectModel(User.name) private readonly User: Model<UserDocument>){
    super({
      jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration:true,
      secretOrKey:configService.get('JWT_SECRET')
    });
  }

  async validate(userForId){
    const user = await this.User.findById(userForId._id).exec()
  }

}