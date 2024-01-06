import { IsDate, IsNotEmpty, IsNumber, IsUUID } from "class-validator";
import { User } from "src/entities/user.entity";

export class CreateAuctionDto {

  @IsNotEmpty()
  title: string
  
  @IsNotEmpty()
  description: string
  
  @IsNotEmpty()
  @IsNumber()
  starting_price: number
  
  @IsNotEmpty()
  end_date: string

  @IsNotEmpty()
  @IsUUID()
  user_id: User
}