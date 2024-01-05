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
  async findAll(): Promise<Auction[]> {
    return this.auctionsService.findAll()
  }

  @Get('my')
  @HttpCode(HttpStatus.OK)
  async findMyAuctions(@Req() req: UserSubRequest): Promise<Auction[]> {
    const user = await this.usersService.findById(req.user.sub)
    return this.auctionsService.findMyAuctions(user)
  }

/*   @Get('my')
  @HttpCode(HttpStatus.OK)
  async findRelations(@Req() req: UserSubRequest, @Query('type') type: string): Promise<Auction[]> {
    const user = await this.usersService.findById(req.user.sub)
    return this.auctionsService.findRelation(user, type)
  }*/

  @Get('won')
  @HttpCode(HttpStatus.OK)
  async findWonAuctions(@Req() req: UserSubRequest): Promise<Auction[]> {
    const user = await this.usersService.findById(req.user.sub)
    return this.auctionsService.findWonAuctions(user)
  }
}
