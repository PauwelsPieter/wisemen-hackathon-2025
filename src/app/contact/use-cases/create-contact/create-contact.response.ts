import { ApiProperty } from '@nestjs/swagger'
import { Contact } from '../../entities/contact.entity.js'
import { ContactUuid } from '../../entities/contact.uuid.js'

export class CreateContactResponse {
  @ApiProperty({ type: String, format: 'uuid' })
  uuid: ContactUuid

  constructor (contact: Contact) {
    this.uuid = contact.uuid
  }
}
