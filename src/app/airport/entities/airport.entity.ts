import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { AirportUuid } from './airport.uuid.js'

@Entity()
export class Airport {
  @PrimaryGeneratedColumn('uuid')
  uuid: AirportUuid

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', unique: true, length: 3 })
  code: string
}
