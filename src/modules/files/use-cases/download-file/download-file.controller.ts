import { Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiResponse } from '@nestjs/swagger'
import { UuidParam } from '@wisemen/decorators'
import { Response } from 'express'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
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
  @ApiResponse({
    status: HttpStatus.FOUND
  })
  async downloadFile (
    @UuidParam('file') fileUuid: string,
    @Res() res: Response
  ): Promise<void> {
    const { file, temporaryUrl } = await this.useCase.execute(fileUuid)

    res.setHeader('Location', temporaryUrl)
    res.setHeader('Content-Disposition', `attachment; filename=${file.name}`)
    res.setHeader('Content-Type', file.mimeType ?? 'application/octet-stream')
    res.redirect(temporaryUrl)
  }
}
