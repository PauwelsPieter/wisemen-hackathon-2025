import { Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiResponse } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Response } from 'express'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { FileUuid } from '../../entities/file.uuid.js'
import { ApiNotFoundErrorResponse } from '../../../exceptions/api-errors/api-error-response.decorator.js'
import { FileNotFoundError } from '../../errors/file.not-found.error.js'
import { DownloadFileUseCase } from './download-file.use-case.js'

@ApiTags('File')
@Controller('files/:file/download')
@ApiOAuth2([])
export class DownloadFileController {
  constructor (
    private readonly useCase: DownloadFileUseCase
  ) {}

  @Post()
  @HttpCode(302)
  @Permissions(Permission.FILE_READ)
  @ApiResponse({ status: HttpStatus.FOUND })
  @ApiNotFoundErrorResponse(FileNotFoundError)
  async downloadFile (
    @UuidParam('file') fileUuid: FileUuid,
    @Res() res: Response
  ): Promise<void> {
    const presignedFile = await this.useCase.execute(fileUuid)

    res.setHeader('Location', presignedFile.url)
    res.setHeader('Content-Disposition', `attachment; filename=${presignedFile.name}`)
    res.setHeader('Content-Type', presignedFile.mimeType ?? 'application/octet-stream')
    res.redirect(presignedFile.url)
  }
}
