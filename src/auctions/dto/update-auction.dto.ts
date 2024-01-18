import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator"

export class UpdateAuctionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  title?: string
  
  @ApiProperty({ required: false })
  @IsOptional()
  description?: string
  
  @ApiProperty({ required: false })
  @IsOptional()
  end_date?: Date
  
  @ApiProperty({ required: false })
  @IsOptional()
  image?: string
}