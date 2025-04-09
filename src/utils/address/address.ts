import { Coordinates } from '@wisemen/coordinates'
import { CoordinatesColumn } from '@wisemen/nestjs-typeorm'
import { Column } from 'typeorm'

export class Address {
  @Column({ type: 'varchar', nullable: true })
  country: string | null

  @Column({ type: 'varchar', nullable: true })
  city: string | null

  @Column({ type: 'varchar', nullable: true })
  postalCode: string | null

  @Column({ type: 'varchar', nullable: true })
  streetName: string | null

  @Column({ type: 'varchar', nullable: true })
  streetNumber: string | null

  @Column({ type: 'varchar', nullable: true })
  unit: string | null

  @CoordinatesColumn({ nullable: true })
  coordinates: Coordinates | null
}
