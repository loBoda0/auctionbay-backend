import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractService } from 'src/common/abstract.service';
import { Bid } from 'src/entities/bid.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BidsService extends AbstractService {
  constructor(@InjectRepository(Bid) private readonly bidsRepository: Repository<Bid>) {
    super(bidsRepository)
  }
}
