import { IsString } from "class-validator";

export class RefreshTokenDto {
  @IsString({
    message:'You didn`t pass refresh token or it is not a string!'
  })
  refreshToken:string;
}