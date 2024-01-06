import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { Auction } from 'src/entities/auction.entity';
import { UserSubRequest } from 'src/interfaces/auth.interface';
import { UsersService } from 'src/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'src/helpers/imageStorage';
import { join } from 'path';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly  auctionsService: AuctionsService, private readonly  usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Auction[]> {
    return this.auctionsService.findAll()
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAuction(@Req() req: UserSubRequest, @Body() createAuctionDto: CreateAuctionDto): Promise<Auction> {
    const user = await this.usersService.findById(req.user.sub)
    const updatedCreateAuctionDto = {
      ...createAuctionDto,
      auctioner: user
    }
    return this.auctionsService.create(updatedCreateAuctionDto)
  }

  

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateAuction(@Req() req: UserSubRequest, @Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto): Promise<Auction> {
    const updatedUpdateAuctionDto = {
      ...updateAuctionDto,
    }
    return this.auctionsService.update(req.user.sub, id, updatedUpdateAuctionDto)
  }

  
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAuction(@Req() req: UserSubRequest, @Param('id') id: string): Promise<any> {
    return this.auctionsService.delete(req.user.sub, id)
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

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('image', saveImageToStorage))
  @HttpCode(HttpStatus.CREATED)
  async upload(@UploadedFile() file, @Req() req: UserSubRequest, @Param('id') id: string): Promise<Auction> {
    const filename = file?.filename

    if (!filename) throw new BadRequestException('File must be a png, jpg/jpeg')

    const imagesFolderPath = join(process.cwd(), 'files')
    const fullImagePath = join(imagesFolderPath + '/' + file.filename)
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.auctionsService.updateAuctionImageId(id, req.user.sub, filename)
    }
    removeFile(fullImagePath)
    throw new BadRequestException('File content does not match extension!')
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<Auction> {
    return this.auctionsService.findById(id, ['bids', 'bids.bidder'])
  }
}
