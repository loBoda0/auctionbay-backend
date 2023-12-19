import  { User } from '../entities/user.entity'
import { Request } from 'express'

export interface TokenPayload {
  name: string
  sub: string
}

export interface RequestWithUser extends Request {
  user: User
}

export enum JwtType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
}
