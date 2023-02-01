import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";

export class JwtAuthGuard extends AuthGuard('jwt'){
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
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
    return true;
  }
}