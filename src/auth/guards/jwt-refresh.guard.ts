import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor(private jwtService: JwtService) {
    super()
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>()

    try {
      const refresh_token = request.cookies['refresh_token']
      if (!refresh_token || !!!this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET
      })) {
        throw new UnauthorizedException()
      }

      return super.canActivate(context)
      } catch (error) {
        throw new UnauthorizedException()
    }
  }
}