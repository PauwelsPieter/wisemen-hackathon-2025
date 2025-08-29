import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags, ApiOkResponse, ApiOAuth2 } from '@nestjs/swagger'
import { Permissions } from '../../../permission/permission.decorator.js'
import { Permission } from '../../../permission/permission.enum.js'
import { CreateNaturalLanguageSearchModelUseCase } from './create-nl-search-model.use-case.js'
import { CreateNaturalLanguageModelCommand } from './create-nl-search-model.command.js'

@ApiTags('Typesense')
@Controller('typesense/create-nl-search-model')
@ApiOAuth2([])
export class CreateNaturalLanguageSearchModelController {
  constructor (
    private readonly useCase: CreateNaturalLanguageSearchModelUseCase
  ) {}

  @Post()
  @Permissions(Permission.TYPESENSE)
  @ApiOkResponse()
  async execute (
    @Body() command: CreateNaturalLanguageModelCommand
  ): Promise<void> {
    await this.useCase.execute(command)
  }
}
