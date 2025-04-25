import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@wisemen/nestjs-typeorm'
import { Repository } from 'typeorm'
import { Contact } from '../../entities/contact.entity.js'
import { ContactUuid } from '../../entities/contact.uuid.js'
import { FilePresigner } from '../../../../modules/files/services/presign-file/file-presigner.js'
import { ViewContactDetailResponse } from './view-contact-detail.response.js'

@Injectable()
export class ViewContactDetailUseCase {
  constructor (
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly filePresigner: FilePresigner
  ) {}

  public async execute (uuid: ContactUuid): Promise<ViewContactDetailResponse> {
    const contact = await this.contactRepository.findOneOrFail({
      where: { uuid },
      relations: {
        avatar: true,
        file: true
      }
    })

    const presignedAvatar = contact.avatar
      ? await this.filePresigner.presign(contact.avatar)
      : null

    return new ViewContactDetailResponse(contact, presignedAvatar)
  }
}
