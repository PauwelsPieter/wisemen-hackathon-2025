import assert from 'assert'
import { Transformer } from '@appwise/transformer'
import { ApiProperty } from '@nestjs/swagger'
import type { User } from '../entities/user.entity.js'
import { RoleTransformer, RoleTransformerType } from '../../roles/transformers/role.transformer.js'

export class UserTransformerType {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty({ type: String, format: 'email' })
  email: string

  @ApiProperty({ type: String, nullable: true, example: 'John' })
  firstName: string | null

  @ApiProperty({ type: String, nullable: true, example: 'Doe' })
  lastName: string | null

  @ApiProperty({ type: () => RoleTransformerType, isArray: true })
  roles: RoleTransformerType[]
}

export interface ExistsTransformerType {
  exists: boolean
}

export class UserTransformer extends Transformer<User, UserTransformerType> {
  transform (user: User): UserTransformerType {
    assert(user.userRoles != null)

    return {
      uuid: user.uuid,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: new RoleTransformer().array(user.userRoles.map((userRole) => {
        assert(userRole.role != null)

        return userRole.role
      }))
    }
  }
}
