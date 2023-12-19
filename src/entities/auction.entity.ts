import { Column, Entity } from "typeorm";
import { Base } from "./base.entity";

@Entity()
export class Auction extends Base {

  @Column()
  title: string
  
  @Column()
  description: string
  
  @Column()
  starting_price: number
  
  @Column()
  end_date: Date
}