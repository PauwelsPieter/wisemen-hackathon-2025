import { ApiProperty } from '@nestjs/swagger'
import { Contact } from '../entities/contact.entity.js'

export class ContactResponse {
  @ApiProperty()
  uuid: string

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  isActive: boolean

  @ApiProperty()
  firstName: string | null

  @ApiProperty()
  lastName: string | null

  @ApiProperty()
  email: string | null

  @ApiProperty()
  phone: string | null

  constructor (contact: Contact) {
    this.uuid = contact.uuid
    this.createdAt = contact.createdAt
    this.updatedAt = contact.updatedAt
    this.isActive = contact.isActive
    this.firstName = contact.firstName
    this.lastName = contact.lastName
    this.email = contact.email
    this.phone = contact.phone
  }
}
