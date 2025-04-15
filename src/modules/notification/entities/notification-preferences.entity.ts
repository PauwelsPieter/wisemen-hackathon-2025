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
import { NotificationType } from '../enums/notification-types.enum.js'
import { User } from '../../../app/users/entities/user.entity.js'

@Entity()
@Index(['channel', 'isEnabled'])
@Unique('UQ_notification_preferences_user_channel', ['userUuid', 'channel'])
export class NotificationPreferences {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @Column('uuid')
  userUuid: string

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_uuid' })
  user?: Relation<User>

  @Column({ type: 'enum', enum: NotificationType, array: true })
  types: NotificationType[]

  @Column({ type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel

  @Column({ type: 'boolean', default: true })
  isEnabled: boolean
}
