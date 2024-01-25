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
import { ApiBody, ApiConsumes, ApiHeader, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auctions')
@Controller('auctions')
export class AuctionsController {
  constructor(private readonly  auctionsService: AuctionsService, private readonly  usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Retrieve a list of auctions' })
  @Get()
  async findAll(): Promise<Auction[]> {
    return this.auctionsService.findAll(['bids', 'bids.bidder', 'winner'])
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    description: 'Create a new auction',
  })
  @ApiBody({
    type: CreateAuctionDto,
    description: 'The auction details',
  })
  @ApiResponse({
    status: 201,
    description: 'The auction has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post()
  async createAuction(@Req() req: UserSubRequest, @Body() createAuctionDto: CreateAuctionDto): Promise<Auction> {
    const user = await this.usersService.findById(req.user.id)
    const updatedCreateAuctionDto = {
      ...createAuctionDto,
      auctioner: user
    }
    return this.auctionsService.create(updatedCreateAuctionDto)
  }  

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description: 'Update a new auction',
  })
  @ApiBody({
    type: UpdateAuctionDto,
    description: 'The auction details',
  })
  @ApiResponse({
    status: 201,
    description: 'The auction has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Patch(':id')
  async updateAuction(@Req() req: UserSubRequest, @Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto): Promise<Auction> {
    const updatedUpdateAuctionDto = {
      ...updateAuctionDto,
    }
    return this.auctionsService.update(req.user.id, id, updatedUpdateAuctionDto)
  }

  
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', description: 'The ID of the auction to delete' })
  @ApiResponse({
    status: 200,
    description: 'The auction has been successfully deleted.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Delete(':id')
  async deleteAuction(@Req() req: UserSubRequest, @Param('id') id: string): Promise<any> {
    return this.auctionsService.delete(req.user.id, id)
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Retrieve auctions by a specific user' })
  @Get('my')
  async findMyAuctions(@Req() req: UserSubRequest): Promise<Auction[]> {
    return this.auctionsService.findMyAuctions(req.user.id, ['bids', 'bids.bidder', 'winner'])
  }
  
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Retrieve bidding auctions by a specific user' })
  @Get('bidding')
  async findRelations(@Req() req: UserSubRequest): Promise<Auction[]> {
    return this.auctionsService.findBiddingAuctions(req.user.id, ['bids', 'bids.bidder', 'winner'])
  }
  
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Retrieve won auctions by a specific user' })
  @Get('won')
  async findWonAuctions(@Req() req: UserSubRequest): Promise<Auction[]> {
    const user = await this.usersService.findById(req.user.id)
    return this.auctionsService.findWonAuctions(user, ['bids', 'bids.bidder', 'winner'])
  }
  
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: 'Upload an image for auction' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'The file to upload',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'The ID of the auction item' })
  @ApiResponse({
    status: 201,
    description: 'The image has been successfully uploaded.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('image', saveImageToStorage))
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req: UserSubRequest, @Param('id') id: string): Promise<Auction> {
    const filename = file?.filename

    if (!filename) throw new BadRequestException('File must be a png, jpg/jpeg')

    const imagesFolderPath = join(process.cwd(), 'files')
    const fullImagePath = join(imagesFolderPath + '/' + file.filename)
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.auctionsService.updateAuctionImageId(id, req.user.id, filename)
    }
    removeFile(fullImagePath)
    throw new BadRequestException('File content does not match extension!')
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get an auction by id' })
  @ApiParam({ name: 'id', description: 'The ID of the auction' })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Auction> {
    return this.auctionsService.findById(id, ['bids', 'bids.bidder', 'winner'])
  }
}
