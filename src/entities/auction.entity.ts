import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";

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

  @ManyToOne(() => User, (user) => user.auctions)
  @JoinColumn({ name: 'user_id'})
  auctioner: User
}