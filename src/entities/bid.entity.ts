import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { Auction } from "./auction.entity";

@Entity()
export class Bid extends Base {
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id'})
  bidder: User

  @ManyToOne(() => Auction)
  @JoinColumn({ name: 'auction_id'})
  auction: Auction

  @Column()
  bid_amount: number
}