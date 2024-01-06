import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

/* @Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super();
  }
  
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true

    
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request);
    
    try {
      const payload = await this.jwtService.verifyAsync(
        token, 
        {
          secret: process.env.JWT_SECRET
        }
      )
      request.user = payload
    } catch (error) {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
} */

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super()
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    const request = context.switchToHttp().getRequest()

    if (isPublic) return true

    try {
      const access_token = request.cookies['access_token']
      const payload = await this.jwtService.verifyAsync(
        access_token, 
        {
          secret: process.env.JWT_SECRET
        }
      )
      request.user = payload
      return !!this.jwtService.verify(access_token)
    } catch (error) {
      console.log(error)
      return false
    }
  }
}