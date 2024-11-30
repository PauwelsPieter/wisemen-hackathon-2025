import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { typeormPagination } from '../../../../utils/typeorm/mappers/paginated-offset-query-to-pagination.mapper.js'
import { ViewContactsResponse } from './view-contacts.response.js'
import { ViewContactsQuery } from './view-contacts.query.js'

@Injectable()
export class ViewContactsUseCase {
  constructor (
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>
  ) {}

  public async execute (
    query: ViewContactsQuery
  ): Promise<ViewContactsResponse> {
    const pagination = typeormPagination(query.pagination)

    const [contacts, count] = await this.contactRepository.findAndCount({
      take: pagination.take,
      skip: pagination.skip,
      order: { uuid: 'ASC' }
    })

    return new ViewContactsResponse(
      contacts,
      count,
      pagination.take,
      pagination.skip
    )
  }
}
