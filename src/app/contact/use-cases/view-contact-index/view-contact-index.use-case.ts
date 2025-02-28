import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { SortDirection, typeormPagination } from '@wisemen/pagination'
import { Contact } from '../../entities/contact.entity.js'
import { ViewContactIndexQuery } from './view-contact-index.query.js'
import { ViewContactIndexResponse } from './view-contact-index.response.js'

@Injectable()
export class ViewContactIndexUseCase {
  constructor (
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>
  ) { }

  public async execute (
    query: ViewContactIndexQuery
  ): Promise<ViewContactIndexResponse> {
    const pagination = typeormPagination(query.pagination)

    const [items, count] = await this.contactRepository.findAndCount({
      take: pagination.take,
      skip: pagination.skip,
      order: { uuid: SortDirection.ASC }
    })

    return new ViewContactIndexResponse(
      items,
      count,
      pagination.take,
      pagination.skip
    )
  }
}
