import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuctionsModule } from 'src/auctions/auctions.module';
import { AuctionsService } from 'src/auctions/auctions.service';
import { Auction } from 'src/entities/auction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Auction]),
    AuctionsModule
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    AuctionsService,
  ],
  exports: [UsersService]
})
export class UsersModule {}
