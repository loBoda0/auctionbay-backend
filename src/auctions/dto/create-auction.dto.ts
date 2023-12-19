import { IsDate, IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreateAuctionDto {

  @IsNotEmpty()
  title: string
  
  @IsNotEmpty()
  description: string
  
  @IsNotEmpty()
  @IsNumber()
  starting_price: number
  
  @IsNotEmpty()
  @IsDate()
  end_date: Date

  @IsNotEmpty()
  @IsUUID()
  user_id: string
}