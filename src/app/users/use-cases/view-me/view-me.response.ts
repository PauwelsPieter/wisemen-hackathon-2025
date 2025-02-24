import assert from 'assert'
import { ApiProperty } from '@nestjs/swagger'
import type { User } from '../../entities/user.entity.js'
import { RoleResponse } from '../../../roles/use-cases/view-role/view-role.response.js'

export class ViewMeResponse {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: string

  @ApiProperty({ type: String, format: 'email' })
  email: string

  @ApiProperty({ type: String, nullable: true, example: 'John' })
  firstName: string | null

  @ApiProperty({ type: String, nullable: true, example: 'Doe' })
  lastName: string | null

  @ApiProperty({ type: () => RoleResponse, isArray: true })
  roles: RoleResponse[]

  constructor (user: User) {
    assert(user.userRoles != null)

    this.uuid = user.uuid.toString()
    this.email = user.email
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.roles = user.userRoles.map((userRole) => {
      assert(userRole.role != null)

      return new RoleResponse(userRole.role)
    })
  }
}
