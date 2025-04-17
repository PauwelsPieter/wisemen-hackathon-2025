import { Controller, Post, HttpCode } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiOkResponse } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { FileUuid } from '../../entities/file.uuid.js'
import { ConfirmFileUploadUseCase } from './confirm-file-upload.use-case.js'

@ApiTags('File')
@Controller('files/:file/confirm-upload')
@ApiOAuth2([])
export class ConfirmFileUploadController {
  constructor (
    private readonly useCase: ConfirmFileUploadUseCase
  ) {}

  @Post()
  @HttpCode(200)
  @Permissions(Permission.FILE_CREATE)
  @ApiOkResponse()
  async confirmFileUpload (
    @UuidParam('file') fileUuid: FileUuid
  ): Promise<void> {
    await this.useCase.execute(fileUuid)
  }
}
