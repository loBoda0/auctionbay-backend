import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtType, TokenPayload } from 'src/interfaces/auth.interface';
import Logging from 'src/library/Logging';

@Injectable()
export class UtilsService {
  constructor (private jwtService: JwtService, private configService: ConfigService) {}

  public async generateToken(userId: string, email: string, type: JwtType): Promise<string> {
    try {
        const payload: TokenPayload = { sub: userId, email }
        let token: string
        switch (type) {
            case JwtType.REFRESH_TOKEN:
                token = await this.jwtService.signAsync(payload, {
                    secret: this.configService.get('JWT_REFRESH_SECRET'),
                    expiresIn: this.configService.get('JWT_REFRESH_SECRET_EXPIRES'),
                })
                break
            case JwtType.ACCESS_TOKEN:
                token = await this.jwtService.signAsync(payload, {
                    secret: this.configService.get('JWT_SECRET'),
                    expiresIn: this.configService.get('JWT_SECRET_EXPIRES'),
                })
                break
            default:
                throw new BadRequestException('Permission denied.')
        }
        return token
    } catch (error) {
        Logging.error(error)
        throw new InternalServerErrorException('Something went wrong while generating a new token.')
    }
}
}
