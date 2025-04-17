import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { ContactUuid } from '../../entities/contact.uuid.js'
import { ViewContactDetailResponse } from './view-contact-detail.response.js'

@Injectable()
export class ViewContactDetailUseCase {
  constructor (
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>
  ) {}

  public async execute (uuid: ContactUuid): Promise<ViewContactDetailResponse> {
    const contact = await this.contactRepository.findOneByOrFail({ uuid })

    return new ViewContactDetailResponse(contact)
  }
}
