import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from 'typeorm'
import { UiTheme } from '../enums/theme.enum.js'
import { User } from '../../users/entities/user.entity.js'
import { FontSize } from '../enums/font-size.enum.js'
import { Locale } from '../../../modules/localization/enums/locale.enum.js'
import { UserUuid } from '../../users/entities/user.uuid.js'

@Entity()
export class UiPreferences {
  @PrimaryGeneratedColumn('uuid')
  userUuid: UserUuid

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_uuid' })
  user: Relation<User>

  @Column({ type: 'enum', enum: UiTheme, default: UiTheme.SYSTEM })
  theme: UiTheme

  @Column({ type: 'varchar' })
  language: Locale

  @Column({ type: 'enum', enum: FontSize, default: FontSize.DEFAULT })
  fontSize: FontSize

  @Column({ type: 'boolean', default: false })
  showShortcuts: boolean

  @Column({ type: 'boolean', default: false })
  reduceMotion: boolean

  @Column({ type: 'boolean', default: false })
  highContrast: boolean
}
