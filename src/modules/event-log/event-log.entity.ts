import { Column, CreateDateColumn, Entity } from 'typeorm'
import { EventType } from '../events/event-type.js'
import { EventSubjectType } from '../events/event-subject-type.enum.js'

@Entity()
export class EventLog {
  @CreateDateColumn({ type: 'timestamptz', primary: true })
  createdAt: Date

  @Column({ type: 'uuid', generated: 'uuid' })
  uuid: string

  @Column({ type: 'varchar' })
  topic: string

  @Column({ type: 'int4' })
  version: number

  @Column({ type: 'varchar' })
  source: string

  @Column({ type: 'varchar' })
  type: EventType

  @Column({ type: 'varchar', nullable: true })
  subjectType: EventSubjectType | null

  @Column({ type: 'uuid', nullable: true })
  subjectId: string | null

  @Column({ type: 'jsonb' })
  content: object

  @Column({ type: 'uuid', nullable: true })
  userUuid: string | null

  @Column({ type: 'varchar', nullable: true })
  traceId: string | null
}
