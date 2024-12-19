import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation, UpdateDateColumn } from 'typeorm'
import { Theme } from '../types/theme.enum.js'
import { User } from '../../users/entities/user.entity.js'

@Entity()
export class Preferences {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Column({ type: 'uuid', unique: true })
  userUuid: string

  @OneToOne(() => User, user => user.preferences)
  @JoinColumn({ name: 'userUuid' })
  user: Relation<User>

  @Column({ type: 'enum', enum: Theme, default: Theme.SYSTEM })
  theme: Theme

  @Column({ type: 'varchar', nullable: true })
  language: string | null

  @Column({ type: 'varchar', nullable: true })
  fontSize: string | null

  @Column({ type: 'boolean', default: false })
  showShortcuts: boolean

  @Column({ type: 'boolean', default: false })
  reduceMotion: boolean

  @Column({ type: 'boolean', default: false })
  highContrast: boolean
}
