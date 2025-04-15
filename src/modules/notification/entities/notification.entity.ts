import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { NotificationType } from '../enums/notification-types.enum.js'
import { Serializable } from '../../../utils/types/serializable.js'

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @Column({ type: 'uuid', nullable: true })
  createdByUserUuid: string | null

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType

  @Column({ type: 'jsonb' })
  meta: Serializable
}
