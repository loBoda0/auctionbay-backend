import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super()
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    
    const request = context.switchToHttp().getRequest()

    if (isPublic) return true

    try {
      const access_token = request.cookies['access_token']
      if (!access_token || !!!this.jwtService.verify(access_token)) {
        throw new UnauthorizedException()
      }
      
      return super.canActivate(context)
      } catch (error) {
        throw new UnauthorizedException()
    }
  }
}