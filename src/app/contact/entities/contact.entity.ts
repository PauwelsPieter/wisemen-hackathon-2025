import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Currency, Monetary, MonetaryAmountColumn, MonetaryColumn } from '@wisemen/monetary'
import { WiseDate, WiseDateColumn } from '@wisemen/wise-date'
import { AddressColumn } from '../../../utils/address/address-column.js'
import { Address } from '../../../utils/address/address.js'
import { ContactUuid } from './contact.uuid.js'

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  uuid: ContactUuid

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @Index()
  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Index()
  @DeleteDateColumn({ precision: 3, nullable: true })
  deletedAt: Date | null

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

  @Column({ type: 'uuid', nullable: true })
  fileUuid: string | null

  @AddressColumn({ nullable: true })
  address: Address | null

  @MonetaryAmountColumn({ currency: Currency.EUR, monetaryPrecision: 4, nullable: true })
  discount: Monetary | null

  @MonetaryColumn({ defaultPrecision: 4, nullable: true })
  balance: Monetary | null

  @WiseDateColumn({ nullable: true })
  birthDate: WiseDate | null
}
