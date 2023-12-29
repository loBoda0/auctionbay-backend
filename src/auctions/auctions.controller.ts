import { Controller, Get, HttpCode, HttpStatus, Query, Req } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { Auction } from 'src/entities/auction.entity';
import { UserSubRequest } from 'src/interfaces/auth.interface';
import { UsersService } from 'src/users/users.service';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly  auctionsService: AuctionsService, private readonly  usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: UserSubRequest, @Query('type') type: string): Promise<Auction[]> {
    if (! type) return this.auctionsService.findAll()
    const user = await this.usersService.findById(req.user.sub)
    return this.auctionsService.findRelation(user, type)
  }
}
