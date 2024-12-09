import assert from 'assert'
import { ApiProperty } from '@nestjs/swagger'
import type { User } from '../../entities/user.entity.js'
import { RoleTransformerType, RoleTransformer } from '../../../roles/transformers/role.transformer.js'

export class ViewMeResponse {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: string

  @ApiProperty({ type: String, format: 'email' })
  email: string

  @ApiProperty({ type: String, nullable: true, example: 'John' })
  firstName: string | null

  @ApiProperty({ type: String, nullable: true, example: 'Doe' })
  lastName: string | null

  @ApiProperty({ type: () => RoleTransformerType, isArray: true })
  roles: RoleTransformerType[]

  constructor (user: User) {
    assert(user.userRoles != null)

    this.uuid = user.uuid.toString()
    this.email = user.email
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.roles = new RoleTransformer().array(user.userRoles.map((userRole) => {
      assert(userRole.role != null)

      return userRole.role
    }))
  }
}
