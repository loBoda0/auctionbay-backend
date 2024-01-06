import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Bid } from 'src/entities/bid.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { AuctionsService } from 'src/auctions/auctions.service';

@Injectable()
export class BidsService extends AbstractService {
  constructor(@InjectRepository(Bid) private readonly bidsRepository: Repository<Bid>, private readonly usersService: UsersService, private readonly auctionsService: AuctionsService
  ) {
    super(bidsRepository)
  }

  async create(userId: string, auctionId: string, bid_amount: number): Promise<Bid> {
    const user = await this.usersService.findById(userId)
    if (!user) throw new BadRequestException('User does not exist')
    const auction = await this.auctionsService.findById(auctionId)
    if (!auction) throw new BadRequestException('auction does not exist')

    try {
      const bid = this.bidsRepository.create({bidder: user, auction, bid_amount})

      return this.bidsRepository.save(bid)
    } catch (error) {
      throw new BadRequestException('Something went wrong while posting a bid.')
    }
  }
}
