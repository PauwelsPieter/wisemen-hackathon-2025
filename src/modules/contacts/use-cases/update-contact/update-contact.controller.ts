import { Body, Controller, Put } from '@nestjs/common'
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { UuidParam } from '../../../../utils/nest/decorators/uuid-param.js'
import { UpdateContactUseCase } from './update-contact.use-case.js'
import { UpdateContactCommand } from './update-contact.command.js'

@Controller('contacts/:uuid')
@ApiTags('Contacts')
@ApiOAuth2([])
export class UpdateContactController {
  constructor (
    private readonly updateContactUseCase: UpdateContactUseCase
  ) {}

  @Put()
  @Permissions(Permission.CONTACT_UPDATE)
  public async updateContact (
    @UuidParam('uuid') uuid: string,
    @Body() command: UpdateContactCommand
  ): Promise<void> {
    await this.updateContactUseCase.execute(uuid, command)
  }
}
