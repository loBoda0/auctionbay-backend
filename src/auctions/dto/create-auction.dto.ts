import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { User } from "src/entities/user.entity";

export class CreateAuctionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  title: string
  
  @ApiProperty({ required: true })
  @IsNotEmpty()
  description: string
  
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  starting_price: number
  
  @ApiProperty({ required: true })
  @ApiProperty({ required: true })
  @IsNotEmpty()
  end_date: string
  
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsUUID()
  user_id: User
}