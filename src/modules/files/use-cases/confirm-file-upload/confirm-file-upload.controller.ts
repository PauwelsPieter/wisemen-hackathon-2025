import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiNoContentResponse } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { FileUuid } from '../../entities/file.uuid.js'
import { ApiNotFoundErrorResponse } from '../../../exceptions/api-errors/api-error-response.decorator.js'
import { FileNotFoundError } from '../../errors/file.not-found.error.js'
import { ConfirmFileUploadUseCase } from './confirm-file-upload.use-case.js'
import { ConfirmFileUploadCommand } from './confirm-file-upload.command.js'

@ApiTags('File')
@Controller('files/:file/confirm-upload')
@ApiOAuth2([])
export class ConfirmFileUploadController {
  constructor (
    private readonly useCase: ConfirmFileUploadUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions(Permission.FILE_CREATE)
  @ApiNoContentResponse()
  @ApiNotFoundErrorResponse(FileNotFoundError)
  async confirmFileUpload (
    @UuidParam('file') fileUuid: FileUuid,
    @Body() command: ConfirmFileUploadCommand
  ): Promise<void> {
    await this.useCase.execute(fileUuid, command)
  }
}
