import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, Point, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from 'typeorm'
import { AirportUuid } from '../../airport/entities/airport.uuid.js'
import { Airport } from '../../airport/entities/airport.entity.js'
import { GseType } from '../enums/gse-type.enum.js'
import { GseUuid } from './gse.uuid.js'

@Entity()
export class Gse {
  @PrimaryGeneratedColumn('uuid')
  uuid: GseUuid

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Column({ type: 'uuid', nullable: true })
  airportUuid: AirportUuid | null

  @ManyToOne(() => Airport)
  @JoinColumn({ name: 'airport_uuid' })
  airport?: Relation<Airport> | null

  @Column({ type: 'enum', enum: GseType })
  type: GseType

  @Column({ type: 'real', default: 0 })
  soc: number

  @Column({ type: 'real', default: 0 })
  temperatureCelsius: number

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326
  })
  location: Point
}
