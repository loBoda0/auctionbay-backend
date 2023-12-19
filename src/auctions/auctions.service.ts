import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Auction } from 'src/entities/auction.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuctionsService extends AbstractService {
  constructor (@InjectRepository(Auction) private readonly auctionsRepository: Repository<Auction>) {
    super(auctionsRepository)
  }
}
