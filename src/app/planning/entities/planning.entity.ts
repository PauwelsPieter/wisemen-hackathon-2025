import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from 'typeorm'
import { GseUuid } from '../../gse/entities/gse.uuid.js'
import { Gse } from '../../gse/entities/gse.entity.js'
import { PlanningUuid } from './planning.uuid.js'

@Entity()
export class Planning {
  @PrimaryGeneratedColumn('uuid')
  uuid: PlanningUuid

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Column({ type: 'uuid' })
  gseUuid: GseUuid

  @ManyToOne(() => Gse)
  @JoinColumn({ name: 'gse_uuid' })
  gse?: Relation<Gse>

  @Column({ type: 'timestamptz' })
  from: Date

  @Column({ type: 'timestamptz' })
  to: Date
}
