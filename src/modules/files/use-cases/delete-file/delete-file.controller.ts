import { Controller, Delete } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiOkResponse } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { DeleteFileUseCase } from './delete-file.use-case.js'

@ApiTags('File')
@Controller('files/:file')
@ApiOAuth2([])
export class DeleteFileController {
  constructor (
    private readonly useCase: DeleteFileUseCase
  ) {}

  @Delete()
  @Permissions(Permission.FILE_DELETE)
  @ApiOkResponse()
  async deleteFile (
    @UuidParam('file') fileUuid: string
  ): Promise<void> {
    await this.useCase.execute(fileUuid)
  }
}
