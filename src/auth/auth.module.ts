
import { Module } from '@nestjs/common';
import { UsersService } from './auth.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
