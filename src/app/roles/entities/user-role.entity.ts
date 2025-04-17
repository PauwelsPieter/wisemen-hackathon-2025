import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation, Unique } from 'typeorm'
import { User } from '../../users/entities/user.entity.js'
import { UserUuid } from '../../users/entities/user.uuid.js'
import { Role } from './role.entity.js'
import { RoleUuid } from './role.uuid.js'
import { UserRoleUuid } from './user-role.uuid.js'

@Entity()
@Unique(['userUuid', 'roleUuid'])
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  uuid: UserRoleUuid

  @Column({ type: 'uuid' })
  userUuid: UserUuid

  @Index()
  @Column({ type: 'uuid' })
  roleUuid: RoleUuid

  @ManyToOne(() => User, user => user.userRoles)
  @JoinColumn({ name: 'user_uuid' })
  user?: Relation<User>

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_uuid' })
  role?: Relation<Role>
}
