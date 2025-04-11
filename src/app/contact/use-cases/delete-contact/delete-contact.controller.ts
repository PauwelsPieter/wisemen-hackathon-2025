import { Controller, Delete, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiNoContentResponse, ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { ApiNotFoundErrorResponse } from '../../../../modules/exceptions/api-errors/api-error-response.decorator.js'
import { ContactNotFoundError } from '../../errors/contact.not-found.error.js'
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @ApiNotFoundErrorResponse(ContactNotFoundError)
  public async deleteContact (
    @UuidParam('uuid') uuid: string
  ): Promise<void> {
    await this.deleteContactUseCase.execute(uuid)
  }
}
