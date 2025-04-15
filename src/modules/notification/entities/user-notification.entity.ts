import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm'
import { NotificationChannel } from '../enums/notification-channel.enum.js'
import { Notification } from './notification.entity.js'

@Entity()
@Index(['notificationUuid', 'channel'])
export class UserNotification {
  @Column({ type: 'uuid', primary: true })
  userUuid: string

  @Column({ type: 'uuid', primary: true })
  notificationUuid: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @Column({ type: 'timestamptz', nullable: true })
  readAt: Date | null

  @Column({ type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel

  @ManyToOne(() => Notification)
  @JoinColumn({ name: 'notification_uuid' })
  notification?: Notification
}
