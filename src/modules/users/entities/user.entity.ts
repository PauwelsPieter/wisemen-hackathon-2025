import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn, DeleteDateColumn,
  OneToMany,
  OneToOne
} from 'typeorm'
import { UserRole } from '../../roles/entities/user-role.entity.js'
import { Preferences } from '../../preferences/entities/preferences.entity.js'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column({ type: 'varchar', unique: true })
  userId: string

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @DeleteDateColumn({ precision: 3 })
  deletedAt: Date

  @Column({ type: 'varchar', unique: true })
  @Index({ unique: true })
  email: string

  @Column({ type: 'varchar', nullable: true })
  firstName: string | null

  @Column({ type: 'varchar', nullable: true })
  lastName: string | null

  @OneToMany(() => UserRole, role => role.user)
  userRoles?: Array<Relation<UserRole>>

  @OneToOne(() => Preferences, preferences => preferences.user)
  preferences: Relation<Preferences>
}
