import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { Bid } from 'src/entities/bid.entity';
import { BidsService } from './bids.service';
import { UserSubRequest } from 'src/interfaces/auth.interface';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Bids')
@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}
  
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Bid[]> {
    return this.bidsService.findAll()
  }
  
  @ApiOperation({
    description: 'Post new bid',
  })
  @ApiBody({
    type: String,
    description: 'Bid price',
  })
  @ApiParam({ name: 'id', description: 'The ID of auction' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post(':id')
  @HttpCode(HttpStatus.OK)
  async placeBid(@Req() req: UserSubRequest, @Param('id') auctionId: string, @Body('bid_amount')  bid_amount: number): Promise<Bid> {
    return this.bidsService.create(req.user.id, auctionId, bid_amount)
  }
}
