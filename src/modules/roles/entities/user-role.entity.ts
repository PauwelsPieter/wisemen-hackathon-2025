import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, Unique } from 'typeorm'
import { User } from '../../users/entities/user.entity.js'
import { Role } from './role.entity.js'

@Entity()
@Unique(['userUuid', 'roleUuid'])
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column({ type: 'uuid' })
  userUuid: string

  @Index()
  @Column({ type: 'uuid' })
  roleUuid: string

  @ManyToOne(() => User, user => user.userRoles)
  @JoinColumn({ name: 'userUuid' })
  user?: Relation<User>

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleUuid' })
  role?: Relation<Role>
}
