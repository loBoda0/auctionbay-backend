import { BadRequestException, Get, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { compareHash, hash } from 'src/utils/bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import resetPassword from 'src/utils/resetPassword';
import Logging from 'src/library/Logging';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findBy({ email: email })
    if (!user) {
      throw new BadRequestException('Invalid credentials.')
    }
    if (!(await compareHash(password, user.password))) {
      throw new BadRequestException('Invalid credentials.')
    }

    return user
  }

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const hashedPassword = await hash(registerUserDto.password)
    const user = await this.usersService.create({
      ...registerUserDto,
      password: hashedPassword
    })
    return user
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    return this.jwtService.signAsync({ sub: loginUserDto.email  })
  }

  async generateJwt(user: User): Promise<string> {
    return this.jwtService.signAsync({ sub: user.id, name: user.email })
  }

  async setNewPassword(token: string, data: any) {
    try {
      const payload = await this.jwtService.verifyAsync(token)
      const user = {...data, ...payload}
      this.usersService.update(payload.id, user)
      
    } catch (error) {
      Logging.error(error)
      throw new BadRequestException("The new password cannot be set")
    }
  }

  async sendResetPassEmail(email: string) {
    const user = await this.usersService.findBy({ email: email }) as User
    if (!user) {
      throw new BadRequestException('Invalid credentials.')
    }
    const id = user.id
    const payload = { email, id }
    
    const expiresIn = 3600

    const token = this.jwtService.sign(payload, { expiresIn })

    resetPassword(email, token)
  }
}

