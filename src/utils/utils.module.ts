import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'

import { UtilsService } from './utils.service'

@Global()
@Module({
    imports: [
      JwtModule.registerAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: `${configService.get('JWT_SECRET_EXPIRES')}s` },
        }),
      }),
    ],
    providers: [UtilsService, JwtService],
    exports: [UtilsService, JwtModule],
})
export class UtilsModule {}