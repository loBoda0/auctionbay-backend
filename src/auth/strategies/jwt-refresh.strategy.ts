import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities/user.entity';
import { TokenPayload } from 'src/interfaces/auth.interface';
import { Request } from 'express';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private usersService: UsersService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.refresh_token
        },
      ]),
      secretOrKey: configService.get('JWT_REFRESH_SECRET'),
      passReqToCallback: true
    })
  }

  async validate(request: Request, payload: TokenPayload): Promise<User> {
    const refresh_token = request.cookies.refresh_token
    const user = await this.usersService.findById(payload.sub)
    if (!user.refresh_token || user.refresh_token !== refresh_token) {
      throw new UnauthorizedException()
    }
    return user
  }
}