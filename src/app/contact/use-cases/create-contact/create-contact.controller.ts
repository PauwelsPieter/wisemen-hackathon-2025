import { Body, Controller, Post } from '@nestjs/common'
import { ApiCreatedResponse, ApiOAuth2, ApiTags } from '@nestjs/swagger'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { ApiNotFoundErrorResponse } from '../../../../modules/exceptions/api-errors/api-error-response.decorator.js'
import { FileNotFoundError } from '../../../../modules/files/errors/file.not-found.error.js'
import { CreateContactCommand } from './create-contact.command.js'
import { CreateContactResponse } from './create-contact.response.js'
import { CreateContactUseCase } from './create-contact.use-case.js'

@ApiTags('Contact')
@ApiOAuth2([])
@Controller('contacts')
export class CreateContactController {
  constructor (
    private readonly createContactUseCase: CreateContactUseCase
  ) { }

  @Post()
  @Permissions(Permission.CONTACT_CREATE)
  @ApiCreatedResponse({ type: CreateContactResponse })
  @ApiNotFoundErrorResponse(FileNotFoundError)
  public async createContact (
    @Body() createContactCommand: CreateContactCommand
  ): Promise<CreateContactResponse> {
    return this.createContactUseCase.execute(createContactCommand)
  }
}
