import { IsNotEmpty, IsNumber, IsOptional } from "class-validator"

export class UpdateAuctionDto {

  @IsOptional()
  title?: string
  
  @IsOptional()
  description?: string
  
  @IsOptional()
  @IsNumber()
  starting_price?: number
  
  @IsOptional()
  end_date?: Date
  
  @IsOptional()
  image?: string

  @IsOptional()
  auctioner?: string
}