import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
  UpdateDateColumn
} from 'typeorm'
import { NotificationChannel } from '../enums/notification-channel.enum.js'
import { NotificationType, NotificationTypeColumn } from '../enums/notification-types.enum.js'
import { User } from '../../../app/users/entities/user.entity.js'
import { UserUuid } from '../../../app/users/entities/user.uuid.js'
import { NotificationPrefrerencesUuid } from './notification-preferences.uuid.js'

@Entity()
@Index(['channel', 'isEnabled'])
@Unique('UQ_notification_preferences_user_channel', ['userUuid', 'channel'])
export class NotificationPreferences {
  @PrimaryGeneratedColumn('uuid')
  uuid: NotificationPrefrerencesUuid

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @Column('uuid')
  userUuid: UserUuid

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_uuid' })
  user?: Relation<User>

  @NotificationTypeColumn({ array: true })
  types: NotificationType[]

  @Column({ type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel

  @Column({ type: 'boolean', default: true })
  isEnabled: boolean
}
