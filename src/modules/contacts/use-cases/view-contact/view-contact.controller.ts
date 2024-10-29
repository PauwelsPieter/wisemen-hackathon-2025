import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { UuidParam } from '../../../../utils/nest/decorators/uuid-param.js'
import { ViewContactUseCase } from './view-contact.use-case.js'
import { ViewContactResponse } from './view-contact.response.js'

@Controller('contacts/:uuid')
@ApiTags('Contacts')
@ApiOAuth2([])
export class ViewContactController {
  constructor (
    private readonly viewContactUseCase: ViewContactUseCase
  ) {}

  @Get()
  @Permissions(Permission.CONTACT_READ)
  public async viewContact (
    @UuidParam('uuid') uuid: string
  ): Promise<ViewContactResponse> {
    return this.viewContactUseCase.execute(uuid)
  }
}
