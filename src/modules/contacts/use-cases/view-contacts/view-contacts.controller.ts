import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiOkResponse } from '@nestjs/swagger'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { ViewContactsResponse } from './view-contacts.response.js'
import { ViewContactsUseCase } from './view-contacts.use-case.js'

@Controller('contacts')
@ApiTags('Contacts')
@ApiOAuth2([])
export class ViewContactsController {
  constructor (
    private readonly viewContactsUseCase: ViewContactsUseCase
  ) {}

  @Get()
  @Permissions(Permission.CONTACT_READ)
  @ApiOkResponse({ type: ViewContactsResponse })
  public async viewContacts (): Promise<ViewContactsResponse> {
    return this.viewContactsUseCase.execute()
  }
}
