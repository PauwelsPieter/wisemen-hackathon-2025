import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, Index } from 'typeorm'
import { Permission } from '../../../modules/permission/permission.enum.js'
import { RoleUuid } from './role.uuid.js'

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  uuid: RoleUuid

  @CreateDateColumn({ precision: 3 })
  createdAt: Date

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date

  @Column({ type: 'varchar', unique: true })
  name: string

  @Column({ type: 'varchar', default: [], array: true })
  permissions: Permission[]

  @Column({ type: 'boolean', default: false })
  @Index({ unique: true, where: 'is_default' })
  isDefault: boolean

  @Column({ type: 'boolean', default: false })
  @Index({ unique: true, where: 'is_system_admin' })
  isSystemAdmin: boolean
}
