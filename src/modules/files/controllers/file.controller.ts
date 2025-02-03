import { Body, Controller, Delete, HttpCode, Post, Res } from '@nestjs/common'
import { ApiOAuth2, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { UuidParam } from '@wisemen/decorators'
import { CreateFileDto } from '../dtos/create-file.dto.js'
import { CreateFileResponse } from '../transformers/file-created.transformer.js'
import { FileFlowService } from '../services/file.flows.service.js'
import { confirmFileUploadApiResponse, createFileApiResponse, downloadFileApiResponse, removeFileApiResponse } from '../../../../docs/files/file-response.docs.js'
import { AuthStorage } from '../../auth/auth.storage.js'

@ApiTags('File')
@Controller('file')
@ApiOAuth2([])
export class FileController {
  constructor (
    private readonly fileFlowService: FileFlowService,
    private readonly authStorage: AuthStorage
  ) {}

  @Post()
  @ApiResponse(createFileApiResponse)
  async createFile (
    @Body() createFileDto: CreateFileDto
  ): Promise<CreateFileResponse> {
    const userUuid = this.authStorage.getUserUuid()
    const { file, uploadUrl } = await this.fileFlowService.create(createFileDto, userUuid)

    return new CreateFileResponse(file, uploadUrl)
  }

  @Post('/:file/confirm-upload')
  @ApiResponse(confirmFileUploadApiResponse)
  @HttpCode(200)
  async confirmFileUpload (
    @UuidParam('file') fileUuid: string
  ): Promise<void> {
    await this.fileFlowService.confirmUploadOrFail(fileUuid)
  }

  @Post('/:file/download')
  @ApiResponse(downloadFileApiResponse)
  @HttpCode(302)
  async downloadFile (
    @UuidParam('file') fileUuid: string,
    @Res() res: Response
  ): Promise<void> {
    const { file, temporaryUrl } = await this.fileFlowService.getTemporaryUrl(fileUuid)

    res.setHeader('Location', temporaryUrl)
    res.setHeader('Content-Disposition', `attachment; filename=${file.name}`)
    res.setHeader('Content-Type', file.mimeType ?? 'application/octet-stream')
    res.redirect(temporaryUrl)
  }

  @Delete('/:file')
  @ApiResponse(removeFileApiResponse)
  async removeFile (
    @UuidParam('file') fileUuid: string
  ): Promise<void> {
    await this.fileFlowService.remove(fileUuid)
  }
}
