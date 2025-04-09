import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { AddressColumn } from '../../../utils/address/address-column.js'
import { Address } from '../../../utils/address/address.js'

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Column({ type: 'boolean', default: true })
  isActive: boolean

  @Column({ type: 'varchar', nullable: true })
  firstName: string | null

  @Column({ type: 'varchar', nullable: true })
  lastName: string | null

  @Column({ type: 'varchar', nullable: true })
  email: string | null

  @Column({ type: 'varchar', nullable: true })
  phone: string | null

  @AddressColumn({ nullable: true })
  address: Address | null
}
