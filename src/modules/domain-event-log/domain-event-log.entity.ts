import { Column, CreateDateColumn, Entity } from 'typeorm'
import { DomainEventType } from '../domain-events/domain-event-type.js'
import { DomainEventSubjectType } from '../domain-events/domain-event-subject-type.enum.js'

@Entity()
export class DomainEventLog {
  @CreateDateColumn({ type: 'timestamptz', primary: true })
  createdAt: Date

  @Column({ type: 'uuid', generated: 'uuid', primary: true })
  uuid: string

  @Column({ type: 'varchar' })
  topic: string

  @Column({ type: 'int4' })
  version: number

  @Column({ type: 'varchar' })
  source: string

  @Column({ type: 'varchar' })
  type: DomainEventType

  @Column({ type: 'varchar', nullable: true })
  subjectType: DomainEventSubjectType | null

  @Column({ type: 'uuid', nullable: true })
  subjectId: string | null

  @Column({ type: 'jsonb' })
  content: object

  @Column({ type: 'uuid', nullable: true })
  userUuid: string | null

  @Column({ type: 'varchar', nullable: true })
  traceId: string | null
}
