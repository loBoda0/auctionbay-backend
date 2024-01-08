import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Base } from "./base.entity";
import { User } from "./user.entity";
import { Bid } from "./bid.entity";

@Entity()
export class Auction extends Base {

  @Column()
  title: string
  
  @Column()
  description: string
  
  @Column()
  starting_price: number
  
  @Column()
  end_date: string

  @Column({default: null})
  image: string | null

  @Column('boolean', {default: true})
  is_active: boolean

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id'})
  auctioner: User

  @ManyToOne(() => User)
  @JoinColumn({ name: 'winner_id'})
  winner: User | null

  @OneToMany(() => Bid, (bid) => bid.auction, {
    cascade: true 
  })
  bids: Bid[]
}