import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { NotificationType } from '../enums/notification-types.enum.js'
import { Serializable } from '../../../utils/types/serializable.js'
import { UserUuid } from '../../../app/users/entities/user.uuid.js'
import { NotificationUuid } from './notification.uuid.js'

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  uuid: NotificationUuid

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @Column({ type: 'uuid', nullable: true })
  createdByUserUuid: UserUuid | null

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType

  @Column({ type: 'jsonb' })
  meta: Serializable
}
