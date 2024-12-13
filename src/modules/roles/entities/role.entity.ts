import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, type Relation } from 'typeorm'
import { Permission } from '../../permission/permission.enum.js'

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
}
