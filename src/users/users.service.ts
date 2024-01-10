import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PostgressErrorCode } from 'src/helpers/postgressErrorCode.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { compareHash, hash } from 'src/utils/bcrypt';

@Injectable()
export class UsersService extends AbstractService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {
    super(usersRepository)
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.findBy({ email: createUserDto.email })
    if (user) {
      throw new BadRequestException('User with that email already exists.')
    }
    try {
      const newUser = this.usersRepository.create({ ...createUserDto})
      return this.usersRepository.save(newUser)
    } catch (error) {
      throw new BadRequestException('Something went wrong while creating a new user.')
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = (await this.findById(id)) as User
    const { email, password, new_password, confirm_password, ...data } = updateUserDto
    if ( email && user.email !== email) {
      user.email = email
    }
    if (password && new_password && confirm_password) {
      if (new_password !== confirm_password) {
        throw new BadRequestException('Passwords do not match.')
      }
      if (await compareHash(new_password, user.password)) {
        throw new BadRequestException('New password cannot be the same as your old password.')
      }
      if (!await compareHash(password, user.password)) {
        throw new BadRequestException('Please enter your current password.')
      }
      user.password = await  hash(new_password)
    }
    try {
      Object.entries(data).map((entry) => {
        user[entry[0]] = entry[1]
      })
      return this.usersRepository.save(user)
    } catch (error) {
      if (error?.code === PostgressErrorCode.UniqueViolation) {
        throw new BadRequestException('User with that email already exists.')
      }
      throw new InternalServerErrorException('Something went wrong while updating the user.')
    }
  }

  async updateUserImageId(id: string, avatar: string): Promise<User> {
    const user = await this.findById(id)
    return this.update(user.id, { avatar })
  }
}
