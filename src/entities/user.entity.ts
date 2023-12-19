import { Exclude } from 'class-transformer'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'

import { Base } from './base.entity'
import { Auction } from './auction.entity'

@Entity()
export class User extends Base {
  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
  first_name: string

  @Column({ nullable: true })
  last_name: string

  @Column({ nullable: true })
  avatar: string

  @Column({ nullable: true })
  @Exclude()
  password: string

  @JoinColumn({ name: 'auction_id' })
  auctions: Auction[]
}
