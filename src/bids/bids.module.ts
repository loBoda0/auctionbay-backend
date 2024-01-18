import { Module } from '@nestjs/common';
import { BidsService } from './bids.service';
import { BidsController } from './bids.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bid } from 'src/entities/bid.entity';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entities/user.entity';
import { AuctionsService } from 'src/auctions/auctions.service';
import { Auction } from 'src/entities/auction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bid, User, Auction]),
  ],
  controllers: [BidsController],
  providers: [
    BidsService,
    AuctionsService,
    UsersService
  ],
})
export class BidsModule {}
