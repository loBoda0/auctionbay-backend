import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/entities/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/decorators/public.decorator';
import { RequestWithUser } from 'src/interfaces/auth.interface';
import { Response } from 'express';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
    async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body)
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response): Promise<User> {
    const access_token = await this.authService.generateJwt(req.user)
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return req.user
  }

/*   @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
    const access_token = await this.authService.generateJwt(req.user)
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    return { data: access_token}
  }  */

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgottenPassword(@Body('email') email) {
    this.authService.sendResetPassEmail(email)
  } 

  @Public()
  @Post('forgot-password/:id')
  @HttpCode(HttpStatus.OK)
  async setNewPassword(@Body() data, @Param('id') id: string) {
    this.authService.setNewPassword(id, data)
  } 
}

