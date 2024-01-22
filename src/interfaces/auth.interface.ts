import  { User } from '../entities/user.entity'
import { Request } from 'express'

export interface TokenPayload {
  email: string
  sub: string
}

export interface RequestWithUser extends Request {
  user: TokenPayload
}

export interface UserSubRequest {
  user: { sub: string }
}

export enum JwtType {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
}
