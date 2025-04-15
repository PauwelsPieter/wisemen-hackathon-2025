import { Column, Entity, PrimaryColumn } from 'typeorm'
import { NotificationType } from '../enums/notification-types.enum.js'

@Entity()
export class NotificationMigration {
  @PrimaryColumn({ type: 'enum', enum: NotificationType })
  type: NotificationType

  @Column({ type: 'timestamptz' })
  migratedAt: Date
}
