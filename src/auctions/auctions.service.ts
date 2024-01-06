import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Auction } from 'src/entities/auction.entity';
import { PaginatedResult } from 'src/interfaces/paginated-result.interface';
import { Repository } from 'typeorm';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuctionsService extends AbstractService {
  constructor (@InjectRepository(Auction) private readonly auctionsRepository: Repository<Auction>) {
    super(auctionsRepository)
  }

  async findMyAuctions(user: User): Promise<Auction[]> {
    try {
      return this.auctionsRepository.find({
        where: {
          auctioner: {
            id: user.id
          }
        },
        loadRelationIds: true
      })
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong while fetching data.')
    }
  }

  async findWonAuctions(user: User): Promise<Auction[]> {
    try {
      return this.auctionsRepository.find({
        where: {
          winner: {
            id: user.id
          }
        }
      })
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Something went wrong while fetching data.')
    }
  }

  async create(createAuctionDto: CreateAuctionDto): Promise<Auction> {
    try {
      const auction = this.auctionsRepository.create(createAuctionDto)

      return this.auctionsRepository.save(auction)
    } catch (error) {
      throw new BadRequestException('Something went wrong while creating a new auction.')
    }
  }

  async update(user_id: string, id: string, updateAuctionDto: UpdateAuctionDto): Promise<Auction> {
    const auction = (await this.findById(id)) as Auction
    try {
      if (auction.auctioner.toString() !== user_id) {
        throw new BadRequestException("Can't update auctions from other users")
      }
      const updatedAuction: any = {
        ...auction,
        title: updateAuctionDto.title !== undefined ? updateAuctionDto.title : auction.title,
        description: updateAuctionDto.description !== undefined ? updateAuctionDto.description : auction.description,
        starting_price: updateAuctionDto.starting_price !== undefined ? updateAuctionDto.starting_price : auction.starting_price,
        end_date: updateAuctionDto.end_date !== undefined ? updateAuctionDto.end_date : auction.end_date,
        image: updateAuctionDto.image !== undefined ? updateAuctionDto.image : auction.description
      }

      return this.auctionsRepository.save(updatedAuction)
    } catch (error) {
      throw new BadRequestException("Something went wrong")
    }
   
  }

  async delete(user_id: string, id: string) {
    const auction = (await this.findById(id, ['auctioner'])) as Auction
    try {
      if (auction.auctioner.toString() !== user_id) {
        throw new BadRequestException("Can't delete auctions from other users")
      }

      return this.auctionsRepository.delete(id)
    } catch (error) {
      throw new BadRequestException("Something went wrong")
    }
  }

  async paginate(page = 1, relations = []): Promise<PaginatedResult> {
    const take = 10

    try {
      const [data, total] = await this.auctionsRepository.findAndCount({
        take,
        skip: (page - 1) * take,
        relations,
        loadRelationIds: true
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

  async updateAuctionImageId(auctionId: string, userId: string, image: string): Promise<Auction> {
    const auction = await this.findById(auctionId) as Auction
    if (auction.auctioner.toString() == userId) {
      return this.update(userId, auctionId, { image })
    }
  }

}
