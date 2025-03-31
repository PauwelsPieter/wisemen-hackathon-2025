import { ApiProperty } from '@nestjs/swagger'
import { TypesenseUser } from '../../../../app/users/typesense/typesense-user.js'

export class SearchCollectionUserResponse {
  @ApiProperty({ format: 'uuid' })
  uuid: string

  @ApiProperty()
  name: string

  @ApiProperty({ format: 'email' })
  email: string

  constructor (user: TypesenseUser) {
    this.uuid = user.id
    this.name = user.firstName + ' ' + user.lastName
    this.email = user.email
  }
}
