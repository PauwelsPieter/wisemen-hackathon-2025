import { ApiProperty } from '@nestjs/swagger'
import { PaginatedOffsetResponse } from '../../../../utils/pagination/offset/paginated-offset.response.js'
import { Contact } from '../../entities/contact.entity.js'
import { ContactResponse } from '../../responses/contact.response.js'

export class ViewContactsResponse extends PaginatedOffsetResponse<ContactResponse> {
  @ApiProperty({ type: ContactResponse, isArray: true })
  declare items: ContactResponse[]

  constructor (contacts: Contact[], total: number, limit: number, offset: number) {
    const items = contacts.map(contact => new ContactResponse(contact))

    super(items, total, limit, offset)
  }
}
