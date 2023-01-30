import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../user/user.schema";
import { Model } from "mongoose";
import { AuthDto } from "./dto/auth.dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenDto } from "./dto/refreshToken.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly User: Model<UserDocument>,
    private readonly jwtService: JwtService
    ) {}

  async register(dto:AuthDto){
    const oldUser = await this.User.findOne({email:dto.email})
    if(oldUser) throw new BadRequestException('User with this email is already exist!')

    const newUser = new this.User({
      email:dto.email,
      password: bcrypt.hashSync(dto.password,10)
    })

    const user = await newUser.save()

    const tokens = await this.issueTokenPair(String(user._id))

    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }

  async getNewTokens({ refreshToken }:RefreshTokenDto){
    if(!refreshToken) throw new UnauthorizedException('Please sign in!')

    const result = await this.jwtService.verifyAsync(refreshToken)
    if(!result) throw new UnauthorizedException('Invalid token or expired!')
    const user = await this.User.findById(result._id)

    const tokens = await this.issueTokenPair(String(user._id))

    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }

  async login(dto){
    const user = await this.validateUser(dto)
    const tokens = await this.issueTokenPair(String(user._id))

    return {
      user: this.returnUserFields(user),
      ...tokens
    }
  }

  async validateUser(dto:AuthDto) {
    const user = await this.User.findOne({ email: dto.email })
    if (!user) throw new UnauthorizedException('User not found!')

    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword) throw new UnauthorizedException('Incorrect password!')

    return user
  }
  async issueTokenPair(userId:string){
    const data = {_id:userId}

    const refreshToken = await this.jwtService.signAsync(data,{
      expiresIn:"24d"
    })
    const accessToken = await this.jwtService.signAsync(data,{
      expiresIn:"2h"
    })
    return {refreshToken,accessToken}
  }
  returnUserFields(user){
    return {
      _id:user._id,
      email: user.email,
      isAdmin: user.isAdmin
    }
  }
}
