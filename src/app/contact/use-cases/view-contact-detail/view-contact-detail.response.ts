import { ApiProperty } from '@nestjs/swagger'
import { MonetaryDto } from '@wisemen/monetary'
import { Contact } from '../../entities/contact.entity.js'
import { AddressResponse } from '../../../../utils/address/address-response.js'

export class ViewContactDetailResponse {
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

  @ApiProperty({ type: AddressResponse, nullable: true })
  address: AddressResponse | null

  @ApiProperty({ type: String, format: 'uuid', nullable: true })
  fileUuid: string | null

  @ApiProperty({ type: MonetaryDto, nullable: true })
  discount: MonetaryDto | null

  @ApiProperty({ type: MonetaryDto, nullable: true })
  balance: MonetaryDto | null

  constructor (contact: Contact) {
    this.uuid = contact.uuid
    this.createdAt = contact.createdAt.toISOString()
    this.updatedAt = contact.updatedAt.toISOString()
    this.isActive = contact.isActive
    this.firstName = contact.firstName
    this.lastName = contact.lastName
    this.email = contact.email
    this.phone = contact.phone
    this.address = contact.address ? new AddressResponse(contact.address) : null
    this.fileUuid = contact.fileUuid
    this.discount = MonetaryDto.from(contact.discount)
    this.balance = MonetaryDto.from(contact.balance)
  }
}
