import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Bid } from 'src/entities/bid.entity';
import { BidsService } from './bids.service';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Bid[]> {
    return this.bidsService.findAll()
  }
}
