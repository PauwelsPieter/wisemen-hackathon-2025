import { Controller, Delete } from '@nestjs/common'
import { ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Permission } from '../../../permission/permission.enum.js'
import { Permissions } from '../../../permission/permission.decorator.js'
import { DeleteContactUseCase } from './delete-contact.use-case.js'

@ApiTags('Contact')
@ApiOAuth2([])
@Controller('contacts/:uuid')
export class DeleteContactController {
  constructor (
    private readonly deleteContactUseCase: DeleteContactUseCase
  ) { }

  @Delete()
  @Permissions(Permission.CONTACT_DELETE)
  public async deleteContact (
    @UuidParam('uuid') uuid: string
  ): Promise<void> {
    await this.deleteContactUseCase.execute(uuid)
  }
}
