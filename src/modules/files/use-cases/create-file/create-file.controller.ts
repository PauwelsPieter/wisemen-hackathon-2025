import { Controller, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOAuth2, ApiCreatedResponse } from '@nestjs/swagger'
import { Permissions } from '../../../../modules/permission/permission.decorator.js'
import { Permission } from '../../../../modules/permission/permission.enum.js'
import { CreateFileCommand } from './create-file.command.js'
import { CreateFileUseCase } from './create-file.use-case.js'
import { CreateFileResponse } from './create-file.response.js'

@ApiTags('File')
@Controller('files')
@ApiOAuth2([])
export class CreateFileController {
  constructor (
    private readonly useCase: CreateFileUseCase
  ) {}

  @Post()
  @Permissions(Permission.FILE_CREATE)
  @ApiCreatedResponse({
    type: CreateFileResponse
  })
  async createFile (
    @Body() command: CreateFileCommand
  ): Promise<CreateFileResponse> {
    return await this.useCase.execute(command)
  }
}
