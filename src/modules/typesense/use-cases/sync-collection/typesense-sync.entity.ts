import { Column, Entity, PrimaryColumn } from 'typeorm'
import { TypesenseCollectionName } from '../../collections/typesense-collection-name.enum.js'

@Entity()
export class TypesenseSync {
  @PrimaryColumn()
  collection: TypesenseCollectionName

  @Column({ type: 'timestamptz' })
  lastSyncedAt: Date
}
