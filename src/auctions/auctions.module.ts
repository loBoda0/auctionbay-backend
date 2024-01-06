import { Module, forwardRef } from '@nestjs/common';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from 'src/entities/auction.entity';
import { User } from 'src/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auction, User]),
    forwardRef(() => UsersModule)
  ],
  controllers: [AuctionsController],
  providers: [
    AuctionsService,
    UsersService
  ],
})
export class AuctionsModule {}
