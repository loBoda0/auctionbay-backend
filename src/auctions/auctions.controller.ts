import { BadRequestException, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { Auction } from 'src/entities/auction.entity';
import { UserSubRequest } from 'src/interfaces/auth.interface';
import { UsersService } from 'src/users/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, removeFile, saveImageToStorage } from 'src/helpers/imageStorage';
import { join } from 'path';

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
}
