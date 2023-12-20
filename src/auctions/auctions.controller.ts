import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Query, Req } from '@nestjs/common';
import { PaginatedResult } from 'src/interfaces/paginated-result.interface';
import { AuctionsService } from './auctions.service';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly  auctionsService: AuctionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query('page') page: number): Promise<PaginatedResult> {
    return this.auctionsService.paginate(page)
  }
}
