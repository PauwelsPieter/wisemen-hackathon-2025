import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, type Relation, Index } from 'typeorm'
import { Permission } from '../../../modules/permission/permission.enum.js'

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Column({ type: 'varchar', unique: true })
  name: string

  @Column({ type: 'varchar', enum: Permission, default: [], array: true })
  permissions: Array<Relation<Permission>>

  @Column({ type: 'boolean', default: false })
  @Index({ unique: true, where: 'is_default' })
  isDefault: boolean

  @Column({ type: 'boolean', default: false })
  @Index({ unique: true, where: 'is_system_admin' })
  isSystemAdmin: boolean
}
