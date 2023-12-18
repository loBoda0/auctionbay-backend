import { BadRequestException, Get, Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { compareHash, hash } from 'src/utils/bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

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

  generateJwt(user: User): Promise<string> {
    return this.jwtService.signAsync({ sub: user.id, name: user.email })
  }
}

