import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm'
import { NotificationChannel } from '../enums/notification-channel.enum.js'
import { UserUuid } from '../../../app/users/entities/user.uuid.js'
import { Notification } from './notification.entity.js'
import { NotificationUuid } from './notification.uuid.js'

@Entity()
@Index(['notificationUuid', 'channel'])
export class UserNotification {
  @Column({ type: 'uuid', primary: true })
  userUuid: UserUuid

  @Column({ type: 'uuid', primary: true })
  notificationUuid: NotificationUuid

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
