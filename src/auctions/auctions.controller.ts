import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req } from '@nestjs/common';
import { PaginatedResult } from 'src/interfaces/paginated-result.interface';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { Auction } from 'src/entities/auction.entity';
import { TokenPayload, UserSubRequest } from 'src/interfaces/auth.interface';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly  auctionsService: AuctionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page: number): Promise<PaginatedResult> {
    return this.auctionsService.paginate(page)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Req() req: UserSubRequest, @Body() createAuctionDto: CreateAuctionDto): Promise<Auction> {
    const updatedCreateAuctionDto = {
      ...createAuctionDto,
      auctioner: req.user.sub
    }
    return this.auctionsService.create(updatedCreateAuctionDto)
  }
}
