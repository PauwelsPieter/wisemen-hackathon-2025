import { Controller, Get } from '@nestjs/common'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { ViewContactsResponse } from './view-contacts.response.js'
import { ViewContactsUseCase } from './view-contacts.use-case.js'

@Controller('contacts')
export class ViewContactsController {
  constructor (
    private readonly viewContactsUseCase: ViewContactsUseCase
  ) {}

  @Get()
  @Permissions(Permission.CONTACT_READ)
  public async viewContacts (): Promise<ViewContactsResponse> {
    return this.viewContactsUseCase.execute()
  }
}
