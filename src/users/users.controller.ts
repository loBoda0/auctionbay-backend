import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TokenPayload, UserSubRequest } from 'src/interfaces/auth.interface';
import { CreateAuctionDto } from 'src/auctions/dto/create-auction.dto';
import { AuctionsService } from 'src/auctions/auctions.service';
import { Auction } from 'src/entities/auction.entity';
import { UpdateAuctionDto } from 'src/auctions/dto/update-auction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'src/helpers/imageStorage';

@Controller('me')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly auctionsService: AuctionsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUser(@Req() req: UserSubRequest): Promise<User> {
    return this.usersService.findById(req.user.sub)
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findById(id)
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto)
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('avatar', saveImageToStorage))
  @HttpCode(HttpStatus.CREATED)
  async upload(@UploadedFile() file, @Req() req: UserSubRequest): Promise<User> {
    const filename = file?.filename

    console.log(filename)

    if (!filename) throw new BadRequestException('File must be a png, jpg/jpeg')

    const imagesFolderPath = join(process.cwd(), 'files')
    const fullImagePath = join(imagesFolderPath + '/' + file.filename)
    if (await isFileExtensionSafe(fullImagePath)) {
      return this.usersService.updateUserImageId(req.user.sub, filename)
    }
    removeFile(fullImagePath)
    throw new BadRequestException('File content does not match extension!')
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, updateUserDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(id)
  }

  @Post('auctions')
  @HttpCode(HttpStatus.CREATED)
  async createAuction(@Req() req: UserSubRequest, @Body() createAuctionDto: CreateAuctionDto): Promise<Auction> {
    const updatedCreateAuctionDto = {
      ...createAuctionDto,
      auctioner: req.user.sub
    }
    return this.auctionsService.create(updatedCreateAuctionDto)
  }

  @Patch('auctions/:id')
  @HttpCode(HttpStatus.CREATED)
  async updateAuction(@Req() req: UserSubRequest, @Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto): Promise<Auction> {
    const updatedUpdateAuctionDto = {
      ...updateAuctionDto,
    }
    return this.auctionsService.update(req.user.sub, id, updatedUpdateAuctionDto)
  }

  
  @Delete('auctions/:id')
  @HttpCode(HttpStatus.CREATED)
  async deleteAuction(@Req() req: UserSubRequest, @Param('id') id: string): Promise<any> {
    return this.auctionsService.delete(req.user.sub, id)
  }
}
