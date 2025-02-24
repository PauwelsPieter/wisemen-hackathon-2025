import { Body, Controller, Put } from '@nestjs/common'
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { UpdateContactUseCase } from './update-contact.use-case.js'
import { UpdateContactCommand } from './update-contact.command.js'

@ApiTags('Contact')
@ApiOAuth2([])
@Controller('contacts/:uuid')
export class UpdateContactController {
  constructor (
    private readonly updateContactUseCase: UpdateContactUseCase
  ) { }

  @Put()
  @Permissions(Permission.CONTACT_UPDATE)
  public async updateContact (
    @UuidParam('uuid') uuid: string,
    @Body() command: UpdateContactCommand
  ): Promise<void> {
    await this.updateContactUseCase.execute(uuid, command)
  }
}
