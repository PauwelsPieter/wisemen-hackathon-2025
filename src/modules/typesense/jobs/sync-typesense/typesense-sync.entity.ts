import { Column, Entity, PrimaryColumn } from 'typeorm'
import { TypesenseCollectionName } from '../../enums/typesense-collection-index.enum.js'

@Entity()
export class TypesenseSync {
  @PrimaryColumn()
  collection: TypesenseCollectionName

  @Column({ type: 'timestamptz' })
  lastSyncedAt: Date
}
