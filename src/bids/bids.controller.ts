import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { Bid } from 'src/entities/bid.entity';
import { BidsService } from './bids.service';
import { UserSubRequest } from 'src/interfaces/auth.interface';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}
  
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Bid[]> {
    return this.bidsService.findAll()
  }
  
  @Post(':id')
  @HttpCode(HttpStatus.OK)
  async placeBid(@Req() req: UserSubRequest, @Param(':id') auctionId: string, @Body('bid_amount')  bid_amount: number): Promise<Bid> {
    return this.bidsService.create(req.user.sub, auctionId, bid_amount)
  }
}
