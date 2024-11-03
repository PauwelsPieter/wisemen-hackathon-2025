import { Controller, Delete } from '@nestjs/common'
import { ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { Permissions } from '../../../permissions/permissions.decorator.js'
import { Permission } from '../../../permissions/permission.enum.js'
import { UuidParam } from '../../../../utils/nest/decorators/uuid-param.js'
import { DeleteContactUseCase } from './delete-contact.use-case.js'

@Controller('contacts/:uuid')
@ApiTags('Contacts')
@ApiOAuth2([])
export class DeleteContractController {
  constructor (
    private readonly deleteContactUseCase: DeleteContactUseCase
  ) {}

  @Delete()
  @Permissions(Permission.CONTACT_DELETE)
  public async deleteContact (
    @UuidParam('uuid') uuid: string
  ): Promise<void> {
    await this.deleteContactUseCase.execute(uuid)
  }
}
