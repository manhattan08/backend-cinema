import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import jwt_decode from "jwt-decode";


export class OnlyAdminGuard implements CanActivate{
  constructor(private reflector:Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if(!authHeader){
      throw new UnauthorizedException({message:"User not authorized!"})
    }
    const bearer = authHeader.split(" ")[0];
    const token = authHeader.split(" ")[1];

    if(bearer!=="Bearer"||!token){
      throw new UnauthorizedException({message:"User not authorized!"})
    }
    const user = jwt_decode(token)
    // @ts-ignore
    if(!user.isAdmin){
      throw new UnauthorizedException({message:"User dont have enough rights!"})
    }
    // @ts-ignore
    return user.isAdmin
  }
}