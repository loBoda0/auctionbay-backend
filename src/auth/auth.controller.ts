import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/entities/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from 'src/decorators/public.decorator';
import { JwtType, RequestWithUser, TokenPayload } from 'src/interfaces/auth.interface';
import { Response } from 'express';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { UtilsService } from 'src/utils/utils.service';
import { UsersService } from 'src/users/users.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

@ApiTags('Authentication')
@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService, private utilsService: UtilsService, private usersService: UsersService) {}

  @Public()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterUserDto })
  @ApiOkResponse({
    type: RegisterUserDto,
    description: 'User registered successfully',
  })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
    async register(@Body() body: RegisterUserDto): Promise<User> {
    return this.authService.register(body)
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({
    type: LoginUserDto,
    description: 'User logged in successfully',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response): Promise<User> {
    const user = await this.usersService.findById(req.user.sub)
    const access_token = await this.utilsService.generateToken(user.id, user.email, JwtType.ACCESS_TOKEN)
    const refresh_token = await this.utilsService.generateToken(user.id, user.email, JwtType.REFRESH_TOKEN)
    await this.usersService.update(user.id, { refresh_token })
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    return user
  }

  @Public()
  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
    const user = await this.usersService.findById(req.user.sub)
    const access_token = await this.utilsService.generateToken(user.id, user.email, JwtType.ACCESS_TOKEN)
    const refresh_token = await this.utilsService.generateToken(user.id, user.email, JwtType.REFRESH_TOKEN)
    await this.usersService.update(user.id, { refresh_token })
    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    })
  } 

  @Public()
  @ApiOperation({ summary: 'Send password reset email' })
  @ApiOkResponse({ description: 'Password reset email sent successfully' })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgottenPassword(@Body('email') email) {
    this.authService.sendResetPassEmail(email)
  } 
  
  @Public()
  @ApiOperation({ summary: 'Set new password' })
  @ApiOkResponse({ description: 'Password has been updated successfully' })
  @Post('forgot-password/:id')
  @HttpCode(HttpStatus.OK)
  async setNewPassword(@Body() data, @Param('id') id: string) {
    this.authService.setNewPassword(id, data)
  }

  @Post('signout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign out a user' })
  @ApiOkResponse({ description: 'User signed out successfully' })
  signout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('user_id');
  }
}

