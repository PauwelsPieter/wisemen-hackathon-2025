import { ApiProperty } from '@nestjs/swagger'
import { PaginatedOffsetResponse } from '@wisemen/pagination'
import { Contact } from '../../entities/contact.entity.js'

export class ContactResponse {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: string

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: string

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt: string

  @ApiProperty({ type: Boolean })
  isActive: boolean

  @ApiProperty({ type: String, nullable: true, example: 'John' })
  firstName: string | null

  @ApiProperty({ type: String, nullable: true, example: 'Doe' })
  lastName: string | null

  @ApiProperty({ type: String, format: 'email', nullable: true })
  email: string | null

  @ApiProperty({ type: String, format: 'phone', nullable: true })
  phone: string | null

  constructor (contact: Contact) {
    this.uuid = contact.uuid
    this.createdAt = contact.createdAt.toISOString()
    this.updatedAt = contact.updatedAt.toISOString()
    this.isActive = contact.isActive
    this.firstName = contact.firstName
    this.lastName = contact.lastName
    this.email = contact.email
    this.phone = contact.phone
  }
}

export class ViewContactIndexResponse extends PaginatedOffsetResponse<ContactResponse> {
  @ApiProperty({ type: ContactResponse, isArray: true })
  declare items: ContactResponse[]

  constructor (items: Contact[], total: number, limit: number, offset: number) {
    const result = items.map(contact => new ContactResponse(contact))

    super(result, total, limit, offset)
  }
}
