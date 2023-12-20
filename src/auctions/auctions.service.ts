import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Auction } from 'src/entities/auction.entity';
import { PaginatedResult } from 'src/interfaces/paginated-result.interface';
import { Repository } from 'typeorm';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Injectable()
export class AuctionsService extends AbstractService {
  constructor (@InjectRepository(Auction) private readonly auctionsRepository: Repository<Auction>) {
    super(auctionsRepository)
  }

  async create(createAuctionDto: CreateAuctionDto): Promise<Auction> {
    console.log(createAuctionDto)
    try {
      const auction = this.auctionsRepository.create(createAuctionDto)
      return this.auctionsRepository.save(auction)
    } catch (error) {
      throw new BadRequestException('Something went wrong while creating a new auction.')
    }
  }

  async paginate(page = 1, relations = []): Promise<PaginatedResult> {
    const take = 10

    try {
      const [data, total] = await this.auctionsRepository.findAndCount({
        take,
        skip: (page - 1) * take,
        relations,
      })

      return {
        data: data,
        meta: {
          total,
          page,
          last_page: Math.ceil(total / take),
        },
      }
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong while searching for a paginated elements.')
    }
  }

}
