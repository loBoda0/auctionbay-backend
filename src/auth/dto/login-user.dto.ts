import { IsEmail, IsNotEmpty, IsOptional, Matches } from "class-validator"
import { Match } from '../../decorators/match.decorator'

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  /* @Matches(/^(?=.*\d)[A-Za-z.\s_-]+[\w~@#$%^&*+=`|{}:;!.?"()[\]-]{6,}/, {
    message:
      'Password must have at least one number, lower or upper case letter and it has to be longer than 5 characters.',
  }) */
  password: string
}